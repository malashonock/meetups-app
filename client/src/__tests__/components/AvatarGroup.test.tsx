/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import React from 'react';
import { render } from '@testing-library/react';

import { AvatarGroup } from 'components';
import { generateUsers } from 'model/__fakes__';

const mockContainerRef = (
  containerWidth: number = 500,
  containerHeight: number = 48,
): void => {
  const mockedContainerRef = {
    get current() {
      return {
        clientWidth: containerWidth,
        clientHeight: containerHeight,
      };
    },
    set current(value) {},
  };

  jest.spyOn(React, 'useRef').mockReturnValue(mockedContainerRef);
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('AvatarGroup', () => {
  describe('if user avatars overflow the container', () => {
    it('for width of 500px and 20 users, renders 7 normal avatars and 1 "rest count" avatar', async () => {
      mockContainerRef(500);

      const { container } = render(<AvatarGroup users={generateUsers(20)} />);

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(7);

      const restCount = container.querySelector('.restCount');
      expect(restCount).toBeInTheDocument();
      expect(restCount).toHaveTextContent('+13');
    });

    it('for width of 400px and 20 users, renders 6 normal avatars and 1 "rest count" avatar', async () => {
      mockContainerRef(400);

      const { container } = render(<AvatarGroup users={generateUsers(20)} />);

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(6);

      const restCount = container.querySelector('.restCount');
      expect(restCount).toBeInTheDocument();
      expect(restCount).toHaveTextContent('+14');
    });

    it('for width of 300px and 20 users, renders 4 normal avatars and 1 "rest count" avatar', async () => {
      mockContainerRef(300);

      const { container } = render(<AvatarGroup users={generateUsers(20)} />);

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(4);

      const restCount = container.querySelector('.restCount');
      expect(restCount).toBeInTheDocument();
      expect(restCount).toHaveTextContent('+16');
    });
  });

  describe('if user avatars fit the container', () => {
    it('for width of 500px and 8 users, renders 8 normal avatars and no "rest count" avatar', async () => {
      mockContainerRef(500);

      const { container } = render(<AvatarGroup users={generateUsers(8)} />);

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(8);

      const restCount = container.querySelector('.restCount');
      expect(restCount).not.toBeInTheDocument();
    });

    it('for width of 500px and 6 users, renders 6 normal avatars and no "rest count" avatar', async () => {
      mockContainerRef(500);

      const { container } = render(<AvatarGroup users={generateUsers(6)} />);

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(6);

      const restCount = container.querySelector('.restCount');
      expect(restCount).not.toBeInTheDocument();
    });
  });

  describe('if max prop is set to 3', () => {
    it('for width of 500px and 10 users, renders 3 normal avatars and 1 "rest count" avatar', async () => {
      mockContainerRef(500);

      const { container } = render(
        <AvatarGroup users={generateUsers(10)} max={3} />,
      );

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(3);

      const restCount = container.querySelector('.restCount');
      expect(restCount).toBeInTheDocument();
      expect(restCount).toHaveTextContent('+7');
    });

    it('for width of 500px and 2 users, renders 2 normal avatars and no "rest count" avatar', async () => {
      mockContainerRef(500);

      const { container } = render(
        <AvatarGroup users={generateUsers(2)} max={3} />,
      );

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(2);

      const restCount = container.querySelector('.restCount');
      expect(restCount).not.toBeInTheDocument();
    });
  });

  describe('if container has zero width', () => {
    it('should not render any avatars', () => {
      mockContainerRef(0, 0, 0);

      const { container } = render(<AvatarGroup users={generateUsers(10)} />);

      const normalAvatars = container.querySelectorAll('.initials');
      expect(normalAvatars.length).toBe(0);

      const restCount = container.querySelector('.restCount');
      expect(restCount).not.toBeInTheDocument();
    });
  });
});
