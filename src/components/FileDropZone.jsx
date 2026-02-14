import { useCallback } from 'react';

function FileDropZone({ onFilesAdded }) {
  const onInputChange = useCallback(
    (event) => {
      onFilesAdded(event.target.files);
      event.target.value = '';
    },
    [onFilesAdded],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      onFilesAdded(event.dataTransfer.files);
    },
    [onFilesAdded],
  );

  return (
    <label className="drop-zone" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={onInputChange}
        className="sr-only"
      />
      <span className="drop-zone-title">Drag & drop your images</span>
      <span className="drop-zone-subtitle">or click to browse JPG, PNG, and WEBP files</span>
    </label>
  );
}

export default FileDropZone;
