import { fireEvent } from '@testing-library/react';
import {
  DefaultBodyType,
  PathParams,
  ResponseResolver,
  RestContext,
  RestRequest,
} from 'msw';

import { API_BASE_URL } from 'api/constants';

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

export const apiUrl = (relativePath: string): string =>
  API_BASE_URL + relativePath;

export type RestResolver = ResponseResolver<
  RestRequest<never, PathParams<string>>,
  RestContext,
  DefaultBodyType
>;
