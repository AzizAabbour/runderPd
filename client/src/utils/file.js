export function getFileExtension(name = '') {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

export function isImageFile(file) {
  return Boolean(file?.type?.startsWith('image/'));
}

export function isPdfFile(file) {
  return file?.type === 'application/pdf' || getFileExtension(file?.name) === 'pdf';
}

export function isVideoFile(file) {
  return Boolean(file?.type?.startsWith('video/'));
}

export function isDocumentFile(file) {
  const extension = getFileExtension(file?.name);
  return ['doc', 'docx', 'rtf', 'odt'].includes(extension);
}

export function matchesAccept(file, accept = '') {
  if (!file || !accept) return true;
  return accept
    .split(',')
    .map((value) => value.trim())
    .some((value) => {
      if (value === '*/*') return true;
      if (value.endsWith('/*')) {
        return file.type.startsWith(value.replace('/*', '/'));
      }
      if (value.startsWith('.')) {
        return file.name.toLowerCase().endsWith(value.toLowerCase());
      }
      return file.type === value;
    });
}

