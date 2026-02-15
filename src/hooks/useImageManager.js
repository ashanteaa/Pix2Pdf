import { useCallback, useEffect, useMemo, useState } from 'react';
import { toDataUrl, validateFile } from '../utils/fileHelpers';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const STORAGE_KEY = 'pastelpdf:images';

const loadSavedImages = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Only restore lightweight metadata + preview needed for export after refresh.
    return parsed
      .filter((item) => item?.id && item?.preview && item?.name)
      .map((item) => ({
        id: item.id,
        preview: item.preview,
        name: item.name,
        file: null,
      }));
  } catch {
    return [];
  }
};

export const useImageManager = () => {
  const [images, setImages] = useState(loadSavedImages);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const payload = images.map(({ id, name, preview }) => ({ id, name, preview }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // If storage quota is exceeded, keep app functional and inform user.
      setError('Your queue is too large to fully persist in browser storage.');
    }
  }, [images]);

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
