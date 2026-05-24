import path from 'node:path';
import sanitizeFilename from 'sanitize-filename';

export function getExtension(filename = '') {
  return path.extname(filename).replace('.', '').toLowerCase();
}

export function sanitizeBaseName(filename = 'file') {
  const base = path.basename(filename, path.extname(filename));
  return sanitizeFilename(base) || 'file';
}

export function matchesPattern(file, patterns = []) {
  if (!patterns.length) return true;

  return patterns.some((pattern) => {
    if (pattern === '*/*') return true;
    if (pattern.endsWith('/*')) {
      return file.mimetype.startsWith(pattern.replace('/*', '/'));
    }
    if (pattern.startsWith('.')) {
      return getExtension(file.originalname) === pattern.slice(1).toLowerCase();
    }
    return file.mimetype === pattern;
  });
}

export function parsePageSelection(value, totalPages) {
  if (!value || value === 'all') {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const selection = new Set();
  String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      if (part.includes('-')) {
        const [startRaw, endRaw] = part.split('-');
        const start = Number(startRaw);
        const end = Number(endRaw);
        const first = Math.min(start, end);
        const last = Math.max(start, end);
        for (let page = first; page <= last; page += 1) {
          if (page >= 1 && page <= totalPages) selection.add(page);
        }
      } else {
        const page = Number(part);
        if (page >= 1 && page <= totalPages) selection.add(page);
      }
    });

  return [...selection].sort((a, b) => a - b);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

