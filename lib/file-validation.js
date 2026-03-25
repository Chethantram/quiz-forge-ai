/**
 * File size validation utilities
 */

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export function validateFileSize(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const fileSize = file.size;
  if (fileSize > MAX_FILE_SIZE) {
    const sizeMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
    return { 
      valid: false, 
      error: `File size exceeds ${sizeMB}MB limit. Your file is ${Math.round(fileSize / (1024 * 1024))}MB.` 
    };
  }

  return { valid: true };
}

export function validateFileType(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF and Word documents (.pdf, .doc, .docx) are allowed'
    };
  }

  return { valid: true };
}

export function validateFile(file) {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) return sizeValidation;

  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) return typeValidation;

  return { valid: true };
}

export const FILE_CONFIG = {
  MAX_SIZE: MAX_FILE_SIZE,
  MAX_SIZE_MB: MAX_FILE_SIZE / (1024 * 1024),
  ALLOWED_TYPES,
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx']
};
