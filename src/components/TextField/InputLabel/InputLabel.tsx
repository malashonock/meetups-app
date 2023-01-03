import { PropsWithChildren } from 'react';

import { Typography } from 'components/Typography/Typography';

import styles from './InputLabel.module.scss';

export const InputLabel = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <Typography variant="heading" className={styles.label}>
      {children}
    </Typography>
  );
};
