import http from 'http';
import fs from 'fs';
import path from 'path';
import { ORIGIN, PUBLIC_DIR, ROOT_DIR } from './constants.mjs';

export const isDateValid = (date) => {
  if (!isNaN(Date.parse(date))) {
    return true;
  }
  return false;
};

export const compareDates = (date1, date2) => {
  if (date1 === undefined || date2 === undefined) {
    return true;
  }
  if (Date.parse(date1) < Date.parse(date2)) {
    return true;
  }
  return false;
};

export const getLastElement = (array) => {
  const [lastElement] = array.slice(-1);
  return lastElement;
}

export const getLastSegment = (pathname) => {
  return getLastElement(pathname.split('/'));
};

export const combineSegments = (pathname) => {
  return pathname.split('/').filter((s) => s).join('-');
};

export const escapeQueryString = (queryString) => {
  return queryString.replace(/[\?\=]/g, '-');
};

export const getExtNameFromResponse = (response) => {
  return response.headers['content-type'].split('/').slice(-1);
};

export const downloadFile = async (externalUrl, downloadDir) => {
  const { pathname, search } = new URL(externalUrl);
  const fileName = combineSegments(pathname) + escapeQueryString(search);
  const filePathWithoutExtension = path.join(downloadDir, fileName);
  let fileExtension = '';

  await fs.promises.mkdir(path.dirname(filePathWithoutExtension), { recursive: true });

  const file = fs.createWriteStream(filePathWithoutExtension);

  await new Promise((resolve) => {
    http.get(externalUrl, (response) => {
      response.pipe(file);

      fileExtension = getExtNameFromResponse(response);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
  });

  const finalFilePath = filePathWithoutExtension + `.${fileExtension}`;
  await fs.promises.rename(filePathWithoutExtension, finalFilePath);

  return finalFilePath;
};

export const getUrlFromPublicPath = (localPath) => {
  const publicUrl = new URL(
    path.relative(
      PUBLIC_DIR,
      localPath,
    ),
    ORIGIN,
  );

  return publicUrl.toString();
};

export function isPast(dateOrString) {
  const now = new Date();
  const date =
    dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
  return date <= now;
};