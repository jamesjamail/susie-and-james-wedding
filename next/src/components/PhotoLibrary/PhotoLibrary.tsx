import styles from "./PhotoLibrary.module.css";
import Image from "next/image";
import fs from "fs";

interface PhotoLibraryProps {
  imagesDirectory: string;
}

const PhotoLibrary: React.FC<PhotoLibraryProps> = ({ imagesDirectory }) => {
  const allFiles = fs.readdirSync(imagesDirectory);

  const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const imageFiles = allFiles.filter((file) => {
    const extension = file.slice(file.lastIndexOf(".")).toLowerCase();
    return validImageExtensions.includes(extension);
  });
  return (
    <div className={styles.grid}>
      {imageFiles.map((file, index) => (
        <div key={index} className={styles.gridItem}>
          <Image
            src={`/images/photos-page-images/${file}`}
            alt={`Photo ${index + 1}`}
            width={300}
            height={300}
            className={styles.image}
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoLibrary;
