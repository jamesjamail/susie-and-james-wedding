"use client";

import { useState } from "react";
import PhotoAlbum, { RowsPhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Fullscreen } from "yet-another-react-lightbox/plugins";
import "react-photo-album/rows.css";

const photos = [
  {
    src: "/images/photos-page-images/CB8F5806-5D10-42CF-9B49-2F409041A588.JPG",
    width: 4,
    height: 3,
  },
  {
    src: "/images/photos-page-images/E1D3E62B-0A18-406F-B947-7FFF5A97CC50.JPG",
    width: 4,
    height: 3,
  },
  {
    src: "/images/photos-page-images/F5FE9C58-C9D8-4D1F-8FA5-A9269E8D15C9.JPG",
    width: 4,
    height: 3,
  },
  { src: "/images/photos-page-images/IMG_0322.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_1308.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_1665.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_2007.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_3175.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_3476.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_4243.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/IMG_7211.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/image000001.JPG", width: 4, height: 3 },
  { src: "/images/photos-page-images/A_0042.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/SP_0013.jpg", width: 4, height: 3 },
  { src: "/images/photos-page-images/SP_0017.jpg", width: 4, height: 3 },
];

const PhotoLibrary = () => {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <PhotoAlbum photos={photos} layout="rows" />
      {index !== null && (
        <Lightbox
          slides={photos}
          open
          index={index}
          close={() => setIndex(null)}
          plugins={[Fullscreen]}
        />
      )}
    </>
  );
};

export default PhotoLibrary;
