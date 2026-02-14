import { useCallback, useMemo, useState } from 'react';
import { toDataUrl, validateFile } from '../utils/fileHelpers';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useImageManager = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const addFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const next = [];
    const issues = [];

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        issues.push(validationError);
        continue;
      }

      const preview = await toDataUrl(file);
      next.push({
        id: uid(),
        file,
        preview,
        name: file.name,
      });
    }

    setImages((previous) => [...previous, ...next]);
    setError(issues.join(' '));
  }, []);

  const removeImage = useCallback((id) => {
    setImages((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const reorderImages = useCallback((sourceIndex, destinationIndex) => {
    if (destinationIndex == null || sourceIndex === destinationIndex) return;

    setImages((previous) => {
      const reordered = [...previous];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(destinationIndex, 0, moved);
      return reordered;
    });
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const hasImages = useMemo(() => images.length > 0, [images.length]);

  return {
    images,
    error,
    hasImages,
    addFiles,
    removeImage,
    reorderImages,
    clearError,
  };
};
