import path from "path";
import fs from "fs";
import PhotoLibrary from "@/components/PhotoLibrary/PhotoLibrary";

export const dynamic = "force-dynamic";

export default async function Photos() {
  const imagesDirectory = path.join(
    process.cwd(),
    "public/images/photos-page-images"
  );
  const allFiles = fs.readdirSync(imagesDirectory);

  const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const imageFiles = allFiles.filter((file) => {
    const extension = file.slice(file.lastIndexOf(".")).toLowerCase();
    return validImageExtensions.includes(extension);
  });

  return (
    <div>
      <main>
        <h1>Photos</h1>
        <PhotoLibrary imageFiles={imageFiles} />
      </main>
    </div>
  );
}
