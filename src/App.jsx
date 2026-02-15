import { useCallback, useMemo, useState } from "react";
import FileDropZone from "./components/FileDropZone";
import ImageGrid from "./components/ImageGrid";
import ExportSettings from "./components/ExportSettings";
import { useImageManager } from "./hooks/useImageManager";
import { usePdfGenerator } from "./hooks/usePdfGenerator";
import SketchButton from "./components/SketchButton";

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
    if (!hasImages) {
      return;
    }
    await generatePdf(images, settings);
  }, [generatePdf, images, settings, hasImages]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  }, []);

  return (
    <main className={appClassName}>
      <div className="container">
        {/* Header */}
        <header className="top-header">
          <div>
            <h1>Pix2Pdf</h1>
            <p>Turn your images into one polished PDF </p>
          </div>
          <button
            type="button"
            className="theme-icon-btn"
            onClick={toggleDarkMode}
            style={{
              width: window.innerWidth < 768 ? "44px" : "54px",
              height: window.innerWidth < 768 ? "44px" : "54px",
              fontSize: window.innerWidth < 768 ? "1.2rem" : "1.5rem",
            }}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            <span aria-hidden="true">{darkMode ? "☀️" : "🌙"}</span>
          </button>
        </header>

        {/* File Drop Zone */}
        <FileDropZone
          onFilesAdded={async (files) => {
            clearError();
            await addFiles(files);
          }}
        />

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button
              type="button"
              onClick={clearError}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0 0.5rem",
              }}
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Export Settings */}
        <ExportSettings
          settings={settings}
          onSettingsChange={onSettingsChange}
        />

        {/* Image Grid or Empty State */}
        {hasImages ? (
          <>
            <ImageGrid
              images={images}
              onRemove={removeImage}
              onReorder={reorderImages}
            />

            {/* Export Button */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                margin: "2rem 0.5rem 0",
              }}
            >
              <SketchButton
                onClick={onGenerate}
                disabled={isGenerating}
                variant="primary"
              >
                {isGenerating ? "⏳ Generating..." : " Convert & Download PDF"}
              </SketchButton>
            </div>

            {/* Image Stats */}
            <div
              style={{
                textAlign: "center",
                margin: "1.5rem 0.5rem",
                fontSize: "0.9rem",
                color: darkMode ? "#b8a8ff" : "#a29bfe",
              }}
            ></div>
          </>
        ) : (
          <div className="empty-state">
            <p>No images yet. Add files to start creating your PDF.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
