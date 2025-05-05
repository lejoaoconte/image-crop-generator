import React, { useCallback, useMemo, useRef, useState } from "react";

type CroppedType = {
  image: HTMLImageElement | null;
  getImageCropped: (image: HTMLImageElement | null) => void;
};

export function Cropped({ getImageCropped, image }: CroppedType) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cropBorder, setCropBorder] = useState({
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  });

  const cropImage = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (image) {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          const croppedWidth = x2 - x1;
          const croppedHeight = y2 - y1;
          canvas.width = croppedWidth;
          canvas.height = croppedHeight;
          ctx.drawImage(
            image,
            x1,
            y1,
            croppedWidth,
            croppedHeight,
            0,
            0,
            croppedWidth,
            croppedHeight
          );
          const finalImageCropped = canvas.toDataURL("image/jpeg");
          const finalImage = new Image();
          finalImage.src = finalImageCropped;
          finalImage.onload = () => {
            getImageCropped(finalImage);
          };
        };
      }
    },
    [getImageCropped, image]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current === null) return;

      const rect = containerRef.current.getBoundingClientRect();

      const x1 = e.clientX - rect.left;
      const y1 = e.clientY - rect.top;

      const handleMouseMove = (e: MouseEvent) => {
        const x2 = e.clientX - rect.left;
        const y2 = e.clientY - rect.top;
        setCropBorder({ x1, x2, y1, y2 });
        cropImage(x1, y1, x2, y2);
      };

      const handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [cropImage]
  );

  const onMouseDownBottonRight = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (containerRef.current === null) return;

      const rect = containerRef.current.getBoundingClientRect();

      const x1 = cropBorder.x1;
      const y1 = cropBorder.y1;

      const handleMouseMove = (e: MouseEvent) => {
        const x2 = e.clientX - rect.left;
        const y2 = e.clientY - rect.top;
        setCropBorder({ x1, x2, y1, y2 });
        cropImage(x1, y1, x2, y2);
      };

      const handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [cropBorder, cropImage]
  );

  const onMouseDownTopLeft = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (containerRef.current === null) return;

      const rect = containerRef.current.getBoundingClientRect();

      const x2 = cropBorder.x2;
      const y2 = cropBorder.y2;

      const handleMouseMove = (e: MouseEvent) => {
        const x1 = e.clientX - rect.left;
        const y1 = e.clientY - rect.top;
        setCropBorder({ x1, x2, y1, y2 });
        cropImage(x1, y1, x2, y2);
      };

      const handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [cropBorder, cropImage]
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: image?.width,
        height: image?.height,
      }}
      onMouseDown={handleMouseDown}
    >
      {image && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${image.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          {cropBorder.x2 > cropBorder.x1 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: cropBorder.x1,
                  top: cropBorder.y1,
                  width: cropBorder.x2 - cropBorder.x1,
                  height: cropBorder.y2 - cropBorder.y1,
                  border: "1px dashed gray",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: "50%",
                  position: "absolute",
                  left: cropBorder.x1 - 5,
                  top: cropBorder.y1 - 5,
                  cursor: "nwse-resize",
                }}
                onMouseDown={onMouseDownTopLeft}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: "50%",
                  position: "absolute",
                  left: cropBorder.x2 - 5,
                  top: cropBorder.y2 - 5,
                  cursor: "nwse-resize",
                }}
                onMouseDown={onMouseDownBottonRight}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
