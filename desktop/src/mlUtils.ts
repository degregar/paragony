import { unlinkSync, writeFileSync } from 'fs';

const { createWorker } = require('tesseract.js');
const sharp = require('sharp');

export const recognize = async (imagePath: string): Promise<string> => {
  return new Promise((resolve) => {
    // TODO: Create lock file

    const worker = createWorker({
      logger: (m: any) => console.log(m),
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage('pol');
      await worker.initialize('pol');

      const response: any = await worker.recognize(imagePath);

      const { text } = response.data;

      resolve(text);

      await worker.terminate();

      // TODO: Remove lock file
    })();
  });
};

export const saveRecognizedTextToFile = async (
  text: string,
  originalImagePath: string
) => {
  const textFilePath = originalImagePath.replace('png', 'txt');

  writeFileSync(textFilePath, text);
};

const addZeroIfNeeded = (value: string | number): string => {
  const tmp = value.toString();

  if (tmp.length < 2) {
    return `0${tmp}`;
  }
  return tmp;
};

export const getDatetime = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = addZeroIfNeeded(today.getMonth());
  const day = addZeroIfNeeded(today.getDay());
  const hours = addZeroIfNeeded(today.getHours());
  const minutes = addZeroIfNeeded(today.getMinutes());
  const seconds = addZeroIfNeeded(today.getSeconds());

  const datetime = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  return datetime;
};

export async function transformFile(receiptFile: any) {
  const receiptPath = `./uploads/${receiptFile.name}`;

  const datetime = getDatetime();
  const pngFilePath = receiptPath.replace('jpg', `png`);
  const newFilePath = pngFilePath.replace('png', `${datetime}.png`);

  await receiptFile.mv(receiptPath);

  sharp.cache(false);
  await sharp(receiptPath).rotate().toFile(newFilePath);

  unlinkSync(receiptPath);

  return newFilePath;
}
