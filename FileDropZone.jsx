import { useCallback, useEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm.js";

function FileDropZone({ onFilesAdded }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const rcRef = useRef(null);

  const onInputChange = useCallback(
    (event) => {
      onFilesAdded(event.target.files);
      event.target.value = "";
    },
    [onFilesAdded]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      onFilesAdded(event.dataTransfer.files);
    },
    [onFilesAdded]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    rcRef.current = rough.canvas(canvas);

    const draw = () => {
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      // Check dark mode RIGHT when drawing
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      rcRef.current.rectangle(4, 4, width - 8, height - 8, {
        stroke: isDark ? "#ff8ab5" : "#ff6b9d",
        strokeWidth: 2,
        roughness: 2.8,
        bowing: 2,
       fill: isDark ? "rgba(216, 196, 255, 0.6)" : "#ffe8f3",
        fillStyle: isDark ? "hachure" : "hachure",
        fillWeight: isDark ? 0.8 : 1.2,
      });
    };

    draw();
    window.addEventListener("resize", draw);

    // Watch for dark mode changes and redraw
    const observer = new MutationObserver(() => {
      draw();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", draw);
      observer.disconnect();
    };
  }, []);

  return (
    <label
      ref={wrapperRef}
      className="drop-zone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{ position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={onInputChange}
        className="sr-only"
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <span className="drop-zone-title">Drag & drop your images</span>
        <span className="drop-zone-subtitle">
          or click to browse JPG, PNG, and WEBP files
        </span>
      </div>
    </label>
  );
}

export default FileDropZone;