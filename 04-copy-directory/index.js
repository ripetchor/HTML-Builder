const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const { mkdir, readdir, rm, unlink } = require('node:fs/promises');
const { pipeline } = require('node:stream/promises');

const copyFile = async ({ srcFile, destFile }) => {
  try {
    const pathToSrcFile = path.resolve(__dirname, srcFile);
    const pathToDestFile = path.resolve(__dirname, destFile);

    const readStream = createReadStream(pathToSrcFile);
    const writeStream = createWriteStream(pathToDestFile);

    return await pipeline(readStream, writeStream);
  } catch (error) {
    throw new Error(error);
  }
};

const clearDirectory = async ({ dirName }) => {
  try {
    const pathToDir = path.resolve(__dirname, dirName);

    const dirents = await readdir(pathToDir, { withFileTypes: true });

    for await (const dirent of dirents) {
      const direntPath = path.resolve(pathToDir, dirent.name);

      if (dirent.isFile()) {
        await unlink(direntPath);
      }

      if (dirent.isDirectory()) {
        await rm(direntPath, { recursive: true });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

const copyDirectory = async ({ srcDir, destDir = `${srcDir}-copy` }) => {
  try {
    const pathToSrcDir = path.resolve(__dirname, srcDir);
    const pathToDestDir = path.resolve(__dirname, destDir);

    await mkdir(pathToDestDir, { recursive: true });

    await clearDirectory({ dirName: pathToDestDir });

    const dirents = await readdir(pathToSrcDir, { withFileTypes: true });

    for await (const dirent of dirents) {
      const srcDirent = path.resolve(pathToSrcDir, dirent.name);
      const destDirent = path.resolve(pathToDestDir, dirent.name);

      if (dirent.isFile()) {
        await copyFile({ srcFile: srcDirent, destFile: destDirent });
      }

      if (dirent.isDirectory()) {
        await copyDirectory({ srcDir: srcDirent, destDir: destDirent });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

copyDirectory({ srcDir: 'files' });
