import path from "path";
import PhotoLibrary from "@/components/PhotoLibrary/PhotoLibrary";

export default function Photos() {
  const imagesDirectory = path.join(
    process.cwd(),
    "public/images/photos-page-images"
  );

  return (
    <div>
      <main>
        <h1>Photos</h1>
        <PhotoLibrary imagesDirectory={imagesDirectory} />
      </main>
    </div>
  );
}
