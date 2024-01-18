const path = require('node:path');
const { createReadStream } = require('node:fs');
const { pipeline } = require('node:stream/promises');
const { stdout } = require('node:process');

const readFile = async ({ fileName }) => {
  try {
    const pathToFile = path.resolve(__dirname, fileName);

    const readStream = createReadStream(pathToFile);

    await pipeline(readStream, stdout);
  } catch (error) {
    throw new Error(error);
  }
};

readFile({ fileName: 'text.txt' });
