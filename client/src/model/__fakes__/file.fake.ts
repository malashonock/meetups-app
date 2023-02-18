import { FileWithUrl } from 'types';
import { Bytes } from 'utils';

export const generateFile = (
  extension: string,
  size: Bytes,
  type: string,
): File => {
  const file = new File(['test'], `test.${extension}`, {
    type: `${type}/${extension}`,
  });
  Object.defineProperty(file, 'size', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: size,
  });
  return file;
};

export const generateFileWithUrl = (
  extension: string,
  size: Bytes,
  type: string,
  url?: string,
): FileWithUrl => {
  const file = generateFile(extension, size, type);
  Object.defineProperty(file, 'url', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: url ?? `http://localhost/${file.name}`,
  });
  return file as FileWithUrl;
};

export const mockImage: File = generateFile('jpg', 1_000_000, 'image');
export const mockLargeImage: File = generateFile('jpg', 100_000_000, 'image');
export const mockNonImage: File = generateFile('pdf', 1_000_000, 'document');
export const mockLargeNonImage: File = generateFile(
  'pdf',
  1_000_000_000,
  'document',
);

export const mockImageWithUrl: FileWithUrl = generateFileWithUrl(
  'jpg',
  1_000_000,
  'image',
);
export const mockImageWithUrl2: FileWithUrl = generateFileWithUrl(
  'png',
  5_000_000,
  'image',
);
export const mockLargeImageWithUrl: FileWithUrl = generateFileWithUrl(
  'jpg',
  100_000_000,
  'image',
);
export const mockNonImageWithUrl: FileWithUrl = generateFileWithUrl(
  'pdf',
  1_000_000,
  'document',
);
export const mockLargeNonImageWithUrl: FileWithUrl = generateFileWithUrl(
  'pdf',
  1_000_000_000,
  'document',
);

export const mockImagesWithUrl: FileWithUrl[] = [
  mockImageWithUrl,
  mockImageWithUrl2,
];
