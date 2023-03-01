// Based on: https://blog.logrocket.com/build-modal-with-react-portals/

import {
  useState,
  useLayoutEffect,
  PropsWithChildren,
  ReactPortal,
} from 'react';
import { createPortal } from 'react-dom';
import { Nullable } from 'types';

const createWrapperAndAppendToBody = (wrapperId: string): HTMLDivElement => {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

interface PortalProps {
  wrapperId?: string;
}

export const Portal = ({
  children,
  wrapperId = 'modal-wrapper',
}: PropsWithChildren<PortalProps>): Nullable<ReactPortal> => {
  const [wrapperElement, setWrapperElement] =
    useState<Nullable<HTMLElement>>(null);

  useLayoutEffect(() => {
    let wrapper = document.getElementById(wrapperId);
    let systemCreated = false;

    // if wrapper is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!wrapper) {
      systemCreated = true;
      wrapper = createWrapperAndAppendToBody(wrapperId);
    }

    setWrapperElement(wrapper);

    return () => {
      // delete the programatically created element
      if (systemCreated && wrapper!.parentNode) {
        wrapper!.parentNode.removeChild(wrapper!);
      }
    };
  }, [wrapperId]);

  // wrapperElement state will be null on the very first render.
  if (wrapperElement === null) {
    return null;
  }

  return createPortal(children, wrapperElement);
};
