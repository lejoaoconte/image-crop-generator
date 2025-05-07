<img src="./image/5854072_arts_cut_cutting_education_school_icon.svg" width="70px" />

# Image Crop Generator

Your complete solution to crop and rotate your image before upload to backend.

This library is created thinking in a simple solution to update your photos before upload on backend, without dependencies, just use inline css and pure React/JS to create it, this library will solution your problems without depends of styled libraries.


## Install

This library use Node 21.7.3 but it's not necessary have this version to usage.

```bash
npm i image-crop-generator
```

```bash
yarn add image-crop-generator
```

## Simple example usage

```javascript
import React, { ChangeEvent, useCallback, useState } from "react";
import { Cropped } from "./cropped";

export function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [croppedImage, setCroppedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [rotate, setRotate] = useState(0);

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
      <input
        max={360}
        type="range"
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setRotate(value);
        }}
        value={rotate}
      />
      <Cropped
        image={image}
        getImageCropped={(img) => {
          setCroppedImage(img);
        }}
        rotate={rotate}
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
```


### License
Licensed under MIT