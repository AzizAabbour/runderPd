import fs from 'fs-extra';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { Document, HeadingLevel, Packer, Paragraph, TextRun, PageBreak } from 'docx';
import { buildOutputPath, buildZipOutputPath, ensureJobOutputDir, getDownloadUrl, zipFiles } from './common.js';
import { parsePageSelection, sanitizeBaseName } from '../../utils/file.js';
import { splitParagraphs } from '../../utils/text.js';
import { cleanupFiles, createPdfFromText } from './common.js';
import { ApiError } from '../../utils/ApiError.js';

async function loadPdfDocument(filePath) {
  const data = await fs.readFile(filePath);
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
  return pdf;
}

async function extractPdfPagesText(filePath) {
  const pdf = await loadPdfDocument(filePath);
  const pages = [];

  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    pages.push(text);
  }

  return pages;
}

async function createDocxFromPages({ title, pages, outputPath }) {
  const children = [new Paragraph({ text: title, heading: HeadingLevel.TITLE })];

  pages.forEach((pageText, index) => {
    children.push(
      new Paragraph({
        text: `Page ${index + 1}`,
        heading: HeadingLevel.HEADING_1,
      }),
    );

    const paragraphs = splitParagraphs(pageText);
    if (!paragraphs.length) {
      children.push(new Paragraph({ text: ' ' }));
    } else {
      paragraphs.forEach((paragraph) => {
        children.push(
          new Paragraph({
            children: [new TextRun(paragraph)],
          }),
        );
      });
    }

    if (index < pages.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);
  return outputPath;
}

export async function processPdfCompression({ files, jobId, options = {}, onProgress }) {
  await ensureJobOutputDir(jobId);
  const file = files[0];
  const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-compressed`, 'pdf');
  const original = await fs.readFile(file.path);
  const pdf = await PDFDocument.load(original);

  onProgress?.(30, 'Optimizing PDF structure');

  pdf.setAuthor('');
  pdf.setTitle('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('File Tools Studio');

  const bytes = await pdf.save({ useObjectStreams: true });
  await fs.writeFile(outputPath, bytes);

  onProgress?.(78, 'Finalizing PDF');

  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}

export async function processMergePdf({ files, jobId, onProgress }) {
  await ensureJobOutputDir(jobId);
  const outputPath = buildOutputPath(jobId, `merged-${sanitizeBaseName(files[0].originalname)}`, 'pdf');
  const mergedPdf = await PDFDocument.create();

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const pdfBytes = await fs.readFile(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
    onProgress?.(20 + Math.round((index / Math.max(1, files.length)) * 55), 'Merging PDFs');
  }

  await fs.writeFile(outputPath, await mergedPdf.save({ useObjectStreams: true }));
  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}

export async function processSplitPdf({ files, jobId, options = {}, onProgress }) {
  await ensureJobOutputDir(jobId);
  const file = files[0];
  const pdfBytes = await fs.readFile(file.path);
  const pdf = await PDFDocument.load(pdfBytes);
  const totalPages = pdf.getPageCount();
  const selectedPages = parsePageSelection(options.pages, totalPages);
  const splitDir = path.join(path.dirname(buildOutputPath(jobId, 'split', 'pdf')), 'pages');
  await fs.ensureDir(splitDir);
  const pageFiles = [];

  for (let index = 0; index < selectedPages.length; index += 1) {
    const pageNumber = selectedPages[index];
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
    newPdf.addPage(copiedPage);
    const outputPath = path.join(splitDir, `${sanitizeBaseName(file.originalname)}-page-${pageNumber}.pdf`);
    await fs.writeFile(outputPath, await newPdf.save({ useObjectStreams: true }));
    pageFiles.push({
      filePath: outputPath,
      name: path.basename(outputPath),
    });
    onProgress?.(25 + Math.round((index / Math.max(1, selectedPages.length)) * 60), 'Splitting PDF');
  }

  const zipPath = buildZipOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-split`);
  await zipFiles({ outputPath: zipPath, entries: pageFiles });
  await cleanupFiles(pageFiles.map((entry) => entry.filePath));

  return {
    outputPath: zipPath,
    outputName: path.basename(zipPath),
    downloadUrl: getDownloadUrl(zipPath),
  };
}

export async function processRemovePdfPages({ files, jobId, options = {}, onProgress }) {
  await ensureJobOutputDir(jobId);
  const file = files[0];
  const pdfBytes = await fs.readFile(file.path);
  const pdf = await PDFDocument.load(pdfBytes);
  const totalPages = pdf.getPageCount();
  const removeSet = new Set(parsePageSelection(options.pages, totalPages));
  const keepPages = pdf
    .getPageIndices()
    .map((index) => index + 1)
    .filter((pageNumber) => !removeSet.has(pageNumber));

  if (!keepPages.length) {
    throw new ApiError(400, 'Removing all pages would leave the PDF empty.');
  }

  const outputPdf = await PDFDocument.create();
  const copiedPages = await outputPdf.copyPages(pdf, keepPages.map((page) => page - 1));
  copiedPages.forEach((page) => outputPdf.addPage(page));

  const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-trimmed`, 'pdf');
  await fs.writeFile(outputPath, await outputPdf.save({ useObjectStreams: true }));
  onProgress?.(80, 'Removed selected pages');

  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}

export async function processPdfToWord({ files, jobId, onProgress }) {
  await ensureJobOutputDir(jobId);
  const file = files[0];
  const pages = await extractPdfPagesText(file.path);
  const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-converted`, 'docx');
  const children = [new Paragraph({ text: sanitizeBaseName(file.originalname), heading: HeadingLevel.TITLE })];

  pages.forEach((pageText, index) => {
    children.push(
      new Paragraph({
        text: `Page ${index + 1}`,
        heading: HeadingLevel.HEADING_1,
      }),
    );

    const paragraphs = splitParagraphs(pageText);
    if (!paragraphs.length) {
      children.push(new Paragraph({ text: ' ' }));
    } else {
      paragraphs.forEach((paragraph) => {
        children.push(new Paragraph({ children: [new TextRun(paragraph)] }));
      });
    }
  });

  const doc = new Document({
    sections: [{ children }],
  });

  await fs.writeFile(outputPath, await Packer.toBuffer(doc));
  onProgress?.(90, 'Created Word document');

  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}

