import React, { useCallback, useEffect, useRef, useState } from "react";

type CroppedType = {
  image: HTMLImageElement | null;
  rotate?: number;
  getImageCropped: (image: HTMLImageElement | null) => void;
};

export function Cropped({ getImageCropped, image, rotate = 0 }: CroppedType) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cropBorder, setCropBorder] = useState({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  });
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(
    image || null
  );

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      canvas.width = img.width;
      canvas.height = img.height;

      const angle = (rotate * Math.PI) / 180;
      const sin = Math.abs(Math.sin(angle));
      const cos = Math.abs(Math.cos(angle));

      const bbW = img.width * cos + img.height * sin;
      const bbH = img.width * sin + img.height * cos;

      const scale = Math.max(canvas.width / bbW, canvas.height / bbH);
      let zoom = Math.max(scale, 1);

      if (
        rotate !== 0 &&
        rotate !== 90 &&
        rotate !== 180 &&
        rotate !== 270 &&
        rotate !== 360
      ) {
        const incresedZoomBasedWidthAndHeight = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        zoom =
          Math.max(scale, 1) +
          Math.abs(Math.sin(angle) * 0.95 * incresedZoomBasedWidthAndHeight);
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.scale(zoom, zoom);
      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      const dataUrl = canvas.toDataURL("image/jpeg");
      const rotImg = new Image();
      rotImg.src = dataUrl;
      rotImg.onload = () => {
        setCurrentImage(rotImg);
        getImageCropped(rotImg);
        setCropBorder({
          startX: 0,
          endX: 0,
          startY: 0,
          endY: 0,
        });
      };
    };
  }, [image, rotate]);

  const cropImage = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      const srcImg = currentImage;
      if (srcImg) {
        const croppedWidth = endX - startX;
        const croppedHeight = endY - startY;
        const canvas = document.createElement("canvas");
        canvas.width = croppedWidth;
        canvas.height = croppedHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(
          srcImg,
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
      }
      return null;
    },
    [getImageCropped]
  );

  const handleMouseMove = (
    e: MouseEvent,
    rect: DOMRect,
    startedX: number = 0,
    startedY: number = 0,
    endedX: number = 0,
    endedY: number = 0,
    type: "create" | "top-left" | "bottom-right"
  ) => {
    let startX = startedX;
    let startY = startedY;
    let endX = endedX;
    let endY = endedY;

    if (type == "create" || type == "bottom-right") {
      endX = e.clientX - rect.left;
      endY = e.clientY - rect.top;
      startX = Math.max(0, startX);
      startY = Math.max(0, startY);
    } else {
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      startX = Math.max(0, startX);
      startY = Math.max(0, startY);
    }
    const srcImg = currentImage;
    if (srcImg) {
      endX = Math.min(endX, srcImg.width);
      endY = Math.min(endY, srcImg.height);
    }
    setCropBorder({ startX, endX, startY, endY });
    cropImage(startX, startY, endX, endY);
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      let startX = e.clientX - rect.left;
      let startY = e.clientY - rect.top;

      const mouseMove = (e: MouseEvent) => {
        handleMouseMove(e, rect, startX, startY, 0, 0, "create");
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [cropImage]
  );

  const onMouseDownBottonRight = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      let startX = cropBorder.startX;
      let startY = cropBorder.startY;

      const mouseMove = (e: MouseEvent) => {
        handleMouseMove(e, rect, startX, startY, 0, 0, "bottom-right");
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [cropBorder, cropImage]
  );

  const onMouseDownTopLeft = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let endX = cropBorder.endX;
      let endY = cropBorder.endY;

      const mouseMove = (e: MouseEvent) => {
        handleMouseMove(e, rect, 0, 0, endX, endY, "top-left");
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", mouseMove);
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
      {currentImage && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${currentImage?.src})`,
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
