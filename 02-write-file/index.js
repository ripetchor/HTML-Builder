const path = require('node:path');
const { createWriteStream } = require('node:fs');
const { stdout, stdin, exit } = require('node:process');

const writeFile = ({ fileName, readStream = stdin }) => {
  const pathToFile = path.resolve(__dirname, fileName);

  const writeStream = createWriteStream(pathToFile);

  stdout.write('Hello!\n');

  readStream.on('data', (data) => {
    const input = data.toString().trim();

    if (input === 'exit' || input === 'EXIT') {
      exit();
    }

    writeStream.write(data);
  });

  readStream.on('error', (error) => {
    throw new Error(error);
  });

  process.on('SIGINT', () => exit());

  process.on('exit', () => stdout.write('Goodbye!\n'));
};

writeFile({ fileName: 'user-input.txt' });
