import * as fs from "node:fs";
import * as path from "path";
import imagemin from "imagemin";
// import imageminJpegtran from "imagemin-jpegtran";
import imageminMozjpeg from "imagemin-mozjpeg";

const EXTENSIONS = [".jpg", ".jpeg"];
let images = [];

const getImages = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (
      fs.statSync(absolute).isDirectory() &&
      file !== "node_modules" &&
      file !== "optimized"
    ) {
      getImages(absolute);
    } else {
      if (EXTENSIONS.includes(path.extname(absolute))) {
        images.push(absolute);
      }
    }
  }
};

(async () => {
  getImages("./");
  if (images.length) {
    console.log("JSON.stringify(images): ", JSON.stringify(images));

    await imagemin(images, {
      destination: "optimized/",
      plugins: [
        // imageminJpegtran()
        imageminMozjpeg({
          quality: 85,
        }),
      ],
    });
  }

  console.log("Finished!");
})();
