"use client";

import styles from "./PhotoLibrary.module.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface PhotoLibraryProps {
  imageFiles: string[];
}

const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ imageFiles }) => {
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
