import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PUBLIC_DIR } from '../constants.mjs';

const UPLOAD_DIR = path.join(PUBLIC_DIR, 'assets', 'images');

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    let fileName = file.originalname === 'blob'
      ? faker.datatype.uuid()
      : file.originalname;

    cb(null, fileName);
  },
});

export const upload = multer({
  storage,
});