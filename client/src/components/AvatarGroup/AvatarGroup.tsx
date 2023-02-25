import { useRef, useState, CSSProperties } from 'react';
import classNames from 'classnames';

import { UserPreview, UserPreviewVariant } from 'components';
import { User } from 'stores';
import { useResizeEffect } from 'hooks';

import styles from './AvatarGroup.module.scss';

enum AvatarGroupVariant {
  Stacked = 'stacked',
  Justified = 'justified',
}

interface AvatarGroupProps {
  users: User[];
  max?: number;
  avatarWidth?: number;
}

export const AvatarGroup = ({
  users,
  max,
  avatarWidth = 48,
}: AvatarGroupProps): JSX.Element => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [sliceCount, setSliceCount] = useState(0);
  const [restCount, setRestCount] = useState(0);
  const GAP = 10; // px

  // repopulate container width with avatars on resize
  useResizeEffect<HTMLUListElement>(
    containerRef,
    (containerWidth: number): void => {
      if (containerWidth && avatarWidth) {
        const fitCount =
          Math.min(Math.floor(containerWidth / avatarWidth), 1) +
          Math.floor(
            Math.max(containerWidth - avatarWidth, 0) / (avatarWidth + GAP),
          );
        const showCount =
          fitCount >= users.length ? users.length : fitCount - 1;
        const cappedShowCount = max ? Math.min(showCount, max) : showCount;
        setSliceCount(cappedShowCount);
        setRestCount(users.length - cappedShowCount);
      }
    },
  );

  const variant = max
    ? AvatarGroupVariant.Stacked
    : AvatarGroupVariant.Justified;

  return (
    <ul
      ref={containerRef}
      className={classNames(styles.container, styles[variant])}
      style={
        {
          '--gap': `${GAP}px`,
        } as CSSProperties
      }
    >
      {users.slice(0, sliceCount).map((user: User) => (
        <li key={user.id} className={styles.avatar}>
          <UserPreview variant={UserPreviewVariant.Image} user={user} />
        </li>
      ))}
      {restCount > 0 && (
        <li key="rest" className={styles.restCount}>
          +{restCount}
        </li>
      )}
    </ul>
  );
};
