import { fireEvent } from '@testing-library/react';

export const dragEventArgsFrom = (fileOrFiles: File | File[]) => {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

  return {
    dataTransfer: {
      files,
      items: files.map((file: File) => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: (): File => file,
      })),
      types: ['Files'],
    },
  };
};

export const dropFile = async (
  fileDropbox: HTMLElement,
  fileOrFiles: File | File[],
) => {
  fireEvent.drop(fileDropbox, dragEventArgsFrom(fileOrFiles));
};

export const dragFile = async (
  fileDropbox: HTMLElement,
  fileOrFiles: File | File[],
) => {
  fireEvent.dragEnter(fileDropbox, dragEventArgsFrom(fileOrFiles));
};
