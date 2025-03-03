"use client";

import styles from "./PhotoLibrary.module.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const imageFiles = [
  "CB8F5806-5D10-42CF-9B49-2F409041A588.JPG",
  "E1D3E62B-0A18-406F-B947-7FFF5A97CC50.JPG",
  "F5FE9C58-C9D8-4D1F-8FA5-A9269E8D15C9.JPG",
  "IMG_0294.jpg",
  "IMG_0298.jpg",
  "IMG_0314.jpg",
  "IMG_0322.jpg",
  "IMG_0491.jpg",
  "IMG_0515.jpg",
  "IMG_0516.jpg",
  "IMG_1076.JPG",
  "IMG_1152.jpg",
  "IMG_1161.jpg",
  "IMG_1163.jpg",
  "IMG_1308.jpg",
  "IMG_1315.jpg",
  "IMG_1337.jpg",
  "IMG_1412.MOV",
  "IMG_1665.jpg",
  "IMG_1710.jpg",
  "IMG_1872.jpg",
  "IMG_1913.jpg",
  "IMG_1926.jpg",
  "IMG_2007.jpg",
  "IMG_3175.jpg",
  "IMG_3476.jpg",
  "IMG_3477.jpg",
  "IMG_4243.jpg",
  "IMG_7202.jpg",
  "IMG_7211.jpg",
  "IMG_8274.jpg",
  "IMG_9502.jpg",
  "IMG_9810.JPG",
  "image000001.JPG",
];

const PhotoLibrary: React.FC = () => {
  return (
    <PhotoProvider>
      <div className={styles.grid}>
        {imageFiles.map((file, index) => (
          <div key={index} className={styles.gridItem}>
            <PhotoView src={`/images/photos-page-images/${file}`}>
              <img
                src={`/images/photos-page-images/${file}`}
                alt={`Photo ${index + 1}`}
                width={300}
                height={300}
                className={styles.image}
              />
            </PhotoView>
          </div>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default PhotoLibrary;
