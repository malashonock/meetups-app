import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { UserPreview, UserPreviewVariant } from 'components';
import { User } from 'stores';

import styles from './AvatarGroup.module.scss';

enum AvatarGroupVariant {
  Stacked = 'stacked',
  Justified = 'justified',
}

interface AvatarGroupProps {
  users: User[];
  max?: number;
}

export const AvatarGroup = ({ users, max }: AvatarGroupProps): JSX.Element => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [containerWidth, setContainerWidth] = useState(
    containerRef.current?.clientWidth || 0,
  );
  const [sliceCount, setSliceCount] = useState(users.length);
  const [restCount, setRestCount] = useState(0);
  const GAP = 10; // px

  // sync container width on resize
  useEffect(() => {
    const updateContainerWidth = (): void => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current?.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return (): void =>
      window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // repopulate container width with avatars
  useLayoutEffect((): void => {
    const avatarWidth = containerRef.current?.children[0]?.clientWidth;

    if (containerWidth && avatarWidth) {
      const fitCount =
        Math.min(Math.floor(containerWidth / avatarWidth), 1) +
        Math.floor(
          Math.max(containerWidth - avatarWidth, 0) / (avatarWidth + GAP),
        );
      const cappedFitCount = max ? Math.min(fitCount, max) : fitCount;
      const showCount =
        cappedFitCount >= users.length ? users.length : cappedFitCount - 1;
      setSliceCount(showCount);
      setRestCount(users.length - showCount);
    }
  }, [containerWidth]);

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
