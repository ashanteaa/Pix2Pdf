import { useCallback, useMemo, useState } from "react";
import FileDropZone from "./components/FileDropZone";
import ImageGrid from "./components/ImageGrid";
import ExportSettings from "./components/ExportSettings";
import { useImageManager } from "./hooks/useImageManager";
import { usePdfGenerator } from "./hooks/usePdfGenerator";
import SketchButton from "./components/sketchbutton";

const initialSettings = {
  orientation: "portrait",
  pageSize: "a4",
  margin: 12,
};

function App() {
  const [settings, setSettings] = useState(initialSettings);
  const [darkMode, setDarkMode] = useState(false);

  const {
    images,
    hasImages,
    error,
    addFiles,
    removeImage,
    reorderImages,
    clearError,
  } = useImageManager();
  const { isGenerating, generatePdf } = usePdfGenerator();

  const appClassName = useMemo(
    () => `app-shell ${darkMode ? "dark" : ""}`,
    [darkMode],
  );

  const onSettingsChange = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onGenerate = useCallback(async () => {
    await generatePdf(images, settings);
  }, [generatePdf, images, settings]);

  return (
    <main className={appClassName}>
      <div className="container">
        <header className="top-header">
          <div>
            <h1>Pix2Pdf</h1>
            <p>Turn your images into one polished PDF.</p>
          </div>
          <button
            type="button"
            className="theme-icon-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            <span aria-hidden="true">{darkMode ? "☀️" : "🌙"}</span>
          </button>
        </header>

        <FileDropZone
          onFilesAdded={async (files) => {
            clearError();
            await addFiles(files);
          }}
        />

        {error ? <p className="error-banner">{error}</p> : null}

        <ExportSettings
          settings={settings}
          onSettingsChange={onSettingsChange}
        />

        {hasImages ? (
          <>
            <ImageGrid
              images={images}
              onRemove={removeImage}
              onReorder={reorderImages}
            />
            <SketchButton onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? "Generating PDF..." : "Convert & Download PDF"}
            </SketchButton>
          </>
        ) : (
          <p className="empty-state">
            No images yet. Add files to start creating your PDF.
          </p>
        )}
      </div>
    </main>
  );
}

export default App;
