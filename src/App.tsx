import React, { ChangeEvent, useCallback, useState } from "react";
import { Cropped } from "./cropped";

export function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [croppedImage, setCroppedImage] = useState<HTMLImageElement | null>(
    null
  );

  const handleSetImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setImage(null);

      if (e.target.files) {
        const file = e.target.files;
        let img = new Image();
        img.src = URL.createObjectURL(file[0]);
        await img.decode();
        setImage(img);
      }
    },
    []
  );

  return (
    <div>
      <input type="file" onChange={(e) => handleSetImage(e)} />
      <Cropped
        image={image}
        getImageCropped={(img) => {
          setCroppedImage(img);
        }}
      />
      {croppedImage && (
        <div>
          <img
            src={croppedImage.src}
            alt="Cropped"
            style={{ width: croppedImage.width, height: croppedImage.height }}
          />
        </div>
      )}
    </div>
  );
}
