const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const { readdir } = require('node:fs/promises');

const mergeStyles = async ({
  srcDir = 'styles',
  destDir = 'project-dist',
  bundleFileName = 'bundle.css',
} = {}) => {
  try {
    const pathToSrcDir = path.resolve(__dirname, srcDir);
    const pathToDestDir = path.resolve(__dirname, destDir);
    const pathToBundleFile = path.resolve(pathToDestDir, bundleFileName);

    const writeStream = createWriteStream(pathToBundleFile);

    const dirents = await readdir(pathToSrcDir, { withFileTypes: true });

    const cssFiles = dirents.filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith('.css'),
    );

    for await (const file of cssFiles) {
      const pathToFile = path.resolve(pathToSrcDir, file.name);
      const readStream = createReadStream(pathToFile);
      readStream.pipe(writeStream);
    }
  } catch (error) {
    throw new Error(error);
  }
};

mergeStyles();
