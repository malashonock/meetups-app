import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  Typography,
  TypographyComponent,
} from 'components';

import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className={styles.wrapper}>
      <Typography
        component={TypographyComponent.Heading1}
        className={styles.text}
      >
        {t('notFoundPage.title')}
      </Typography>

      <div className={styles.picture}>
        <div className={styles.number}>4</div>
        <div className={styles.illustration}>
          <div className={styles.circle}></div>
          <div className={styles.clip}>
            <div className={styles.paper}>
              <div className={styles.face}>
                <div className={styles.eyes}>
                  <div className={classNames(styles.eye, styles.eyeLeft)}></div>
                  <div
                    className={classNames(styles.eye, styles.eyeRight)}
                  ></div>
                </div>
                <div
                  className={classNames(styles.cheeks, styles.cheeksLeft)}
                ></div>
                <div
                  className={classNames(styles.cheeks, styles.cheeksRight)}
                ></div>
                <div className={styles.mouth}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.number}>4</div>
      </div>

      <Button variant={ButtonVariant.Primary} onClick={() => navigate('/')}>
        {t('notFoundPage.redirectLink')}
      </Button>
    </section>
  );
};
