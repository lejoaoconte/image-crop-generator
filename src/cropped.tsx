import React, { useCallback, useMemo, useRef, useState } from "react";

type CroppedType = {
  image: HTMLImageElement | null;
  getImageCropped: (image: HTMLImageElement | null) => void;
};

export function Cropped({ getImageCropped, image }: CroppedType) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cropBorder, setCropBorder] = useState({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  });

  const cropImage = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      if (image) {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          const croppedWidth = endX - startX;
          const croppedHeight = endY - startY;
          canvas.width = croppedWidth;
          canvas.height = croppedHeight;
          ctx.drawImage(
            image,
            startX,
            startY,
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

      let startX = e.clientX - rect.left;
      let startY = e.clientY - rect.top;

      const handleMouseMove = (e: MouseEvent) => {
        let endX = e.clientX - rect.left;
        let endY = e.clientY - rect.top;

        if (startX < 0) {
          startX = 0;
        }
        if (startY < 0) {
          startY = 0;
        }
        if (image && endX > image.width) {
          endX = image.width;
        }
        if (image && endY > image.height) {
          endY = image.height;
        }

        setCropBorder({ startX, endX, startY, endY });
        cropImage(startX, startY, endX, endY);
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

      let startX = cropBorder.startX;
      let startY = cropBorder.startY;

      const handleMouseMove = (e: MouseEvent) => {
        let endX = e.clientX - rect.left;
        let endY = e.clientY - rect.top;

        if (startX < 0) {
          startX = 0;
        }
        if (startY < 0) {
          startY = 0;
        }
        if (image && endX > image.width) {
          endX = image.width;
        }
        if (image && endY > image.height) {
          endY = image.height;
        }

        setCropBorder({ startX, endX, startY, endY });
        cropImage(startX, startY, endX, endY);
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

      let endX = cropBorder.endX;
      let endY = cropBorder.endY;

      const handleMouseMove = (e: MouseEvent) => {
        let startX = e.clientX - rect.left;
        let startY = e.clientY - rect.top;
        if (startX < 0) {
          startX = 0;
        }
        if (startY < 0) {
          startY = 0;
        }
        if (image && endX > image.width) {
          endX = image.width;
        }
        if (image && endY > image.height) {
          endY = image.height;
        }

        setCropBorder({ startX, endX, startY, endY });
        cropImage(startX, startY, endX, endY);
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
          {cropBorder.endX > cropBorder.startX && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: cropBorder.startX,
                  top: cropBorder.startY,
                  width: cropBorder.endX - cropBorder.startX,
                  height: cropBorder.endY - cropBorder.startY,
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
                  left: cropBorder.startX - 5,
                  top: cropBorder.startY - 5,
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
                  left: cropBorder.endX - 5,
                  top: cropBorder.endY - 5,
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
