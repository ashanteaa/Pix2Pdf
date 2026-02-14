import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB } from './constants';

export const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const validateFile = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `“${file.name}” is not supported. Please upload JPG, PNG, or WEBP images.`;
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `“${file.name}” is too large (max ${MAX_FILE_SIZE_MB}MB).`;
  }

  return null;
};

export const compressImage = (dataUrl, { maxDimension = 2200, quality = 0.84 } = {}) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not process image.'));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);

      // JPEG balances quality and resulting PDF size for most photos.
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve({ dataUrl: compressed, width, height });
    };

    image.onerror = reject;
    image.src = dataUrl;
  });
