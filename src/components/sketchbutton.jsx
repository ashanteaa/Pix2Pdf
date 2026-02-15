import { useEffect, useRef } from "react";
import rough from "roughjs/bundled/rough.esm.js";

function SketchButton({ children, onClick, disabled }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const rc = rough.canvas(canvas);

    const resize = () => {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;

      rc.rectangle(
        2,
        2,
        wrapper.offsetWidth - 4,
        wrapper.offsetHeight - 4,
        {
          stroke: "#ff6b9d",
          strokeWidth: 3,
          roughness: 2.5,
          bowing: 2,
        }
      );
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
          border: "none",
          padding: "1.1rem 1.8rem",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#ff6b9d",
          cursor: "pointer",
        }}
      >
        {children}
      </button>
    </div>
  );
}

export default SketchButton;
