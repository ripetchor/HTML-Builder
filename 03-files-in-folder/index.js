const path = require('node:path');
const { readdir, stat } = require('node:fs/promises');
const { stdout } = require('node:process');

const readDirectory = async ({ dirName }) => {
  try {
    const pathToDir = path.resolve(__dirname, dirName);

    const dirents = await readdir(pathToDir, { withFileTypes: true });

    for await (const dirent of dirents) {
      if (dirent.isFile()) {
        const pathToFile = path.resolve(pathToDir, dirent.name);

        const { ext, name } = path.parse(pathToFile);

        const { size } = await stat(pathToFile);

        stdout.write(`${name} - ${ext.slice(1)} - ${size} bytes\n`);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

readDirectory({ dirName: 'secret-folder' });
