import { useCallback, useMemo, useState } from "react";

type CroppedType = {
  image: HTMLImageElement | null;
  getImageCropped: (image: HTMLImageElement | null) => void;
};

export const Cropped = ({ getImageCropped, image }: CroppedType) => {
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
      const x1 = e.clientX;
      const y1 = e.clientY;

      const handleMouseMove = (e: MouseEvent) => {
        const x2 = e.clientX;
        const y2 = e.clientY;
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

  return (
    <div>
      {image && (
        <div
          style={{
            width: image?.width,
            height: image?.height,
            backgroundImage: `url(${image?.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseDown={(e) => handleMouseDown(e)}
        />
      )}
      {useMemo(
        () =>
          cropBorder &&
          cropBorder.x1 > 0 && (
            <div
              style={{
                position: "absolute",
                left: cropBorder.x1,
                top: cropBorder.y1,
                width: cropBorder.x2 - cropBorder.x1,
                height: cropBorder.y2 - cropBorder.y1,
                border: "0.5px dashed gray",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                pointerEvents: "none",
                zIndex: 10000000,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -5,
                  top: -5,
                  width: 10,
                  height: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: cropBorder.x2 - cropBorder.x1 - 5,
                  top: cropBorder.y2 - cropBorder.y1 - 5,
                  width: 10,
                  height: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
          ),
        [cropBorder]
      )}
    </div>
  );
};
