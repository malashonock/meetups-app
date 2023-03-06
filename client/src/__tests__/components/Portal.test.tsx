/* eslint-disable testing-library/no-node-access */

import { render, screen } from '@testing-library/react';

import { Portal } from 'components';

afterEach(() => {
  // remove all portals manually
  const portals = document.querySelectorAll<HTMLDivElement>(
    'body > div[id$=-root]',
  );
  portals.forEach((portal: HTMLDivElement) =>
    portal.parentNode?.removeChild(portal),
  );
});

describe('Portal component', () => {
  describe('given no wrapperId', () => {
    it('should create and append a div#modal-root to document.body', () => {
      render(<Portal>Portal content</Portal>);

      expect(screen.getByText('Portal content')).toBeInTheDocument();
      expect(document.querySelector('body > #modal-root')).toBeInTheDocument();
    });
  });

  describe('given a wrapperId', () => {
    it('should append a div with the specified id to document.body', () => {
      render(<Portal wrapperId="toast-root">Toasts</Portal>);

      expect(screen.getByText('Toasts')).toBeInTheDocument();
      expect(document.querySelector('body > #toast-root')).toBeInTheDocument();
    });
  });

  describe('given the wrapper already exists', () => {
    it('should use the existing wrapper', () => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'modal-root');
      document.body.append(wrapper);

      render(<Portal>Portal content</Portal>);

      expect(screen.getByText('Portal content')).toBeInTheDocument();
      expect(document.querySelectorAll('body > #modal-root').length).toBe(1);
    });
  });

  it('should render the portal div outside the main app root', () => {
    render(
      <>
        <div>Main app</div>
        <Portal>Portal content</Portal>
      </>,
    );

    expect(screen.getByText('Portal content')).toBeInTheDocument();
    expect(document.querySelector('body > #modal-root')).toBeInTheDocument();
  });

  it('should remove the portal div after component unmounts', () => {
    const { unmount } = render(<Portal>Portal content</Portal>);
    expect(screen.getByText('Portal content')).toBeInTheDocument();
    expect(document.querySelector('body > #modal-root')).toBeInTheDocument();

    unmount();

    expect(screen.queryByText('Portal content')).toBeNull();
    expect(document.querySelector('body > #modal-root')).toBeNull();
  });
});
