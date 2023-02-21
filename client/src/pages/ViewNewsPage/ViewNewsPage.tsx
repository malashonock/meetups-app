import { useLocation, useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  LoadingSpinner,
  Typography,
  TypographyComponent,
} from 'components';
import { useAuthStore, useNewsArticle } from 'hooks';

import styles from './ViewNewsPage.module.scss';
import defaultImage from 'assets/images/default-background-blue.jpg';

export const ViewNewsPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const newsArticle = useNewsArticle(id);
  const { t } = useTranslation();
  const { loggedUser } = useAuthStore();

  const handleBack = (): void => navigate(-1);
  const handleEdit = (): void => navigate(pathname + '/edit');

  if (!newsArticle) {
    return <LoadingSpinner text={t('loadingText.newsArticle')} />;
  }

  const { image, title, text } = newsArticle;

  const renderImage = (): JSX.Element => {
    return (
      <figure className={classNames(styles.section, styles.imageWrapper)}>
        <img
          className={styles.image}
          src={image?.url ?? defaultImage}
          alt={t('viewNewsPage.imgAlt') || 'News image'}
        />
      </figure>
    );
  };

  const renderContent = (): JSX.Element => (
    <div className={classNames(styles.textSection, styles.main)}>
      <Typography
        className={styles.title}
        component={TypographyComponent.Heading2}
      >
        {title}
      </Typography>
      <Typography
        className={styles.text}
        component={TypographyComponent.Paragraph}
      >
        {text}
      </Typography>
    </div>
  );

  const renderActions = (): JSX.Element => {
    return (
      <div className={classNames(styles.textSection, styles.actions)}>
        <Button
          id="btn-back"
          variant={ButtonVariant.Default}
          className={classNames(styles.actionButton, styles.backBtn)}
          onClick={handleBack}
        >
          {t('formButtons.back')}
        </Button>
        {loggedUser ? (
          <div className={styles.actionGroup}>
            <Button
              id="btn-edit"
              variant={ButtonVariant.Secondary}
              className={classNames(styles.actionButton, styles.editBtn)}
              onClick={handleEdit}
            >
              {t('formButtons.edit')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section className={styles.container}>
      <Typography
        className={styles.heading}
        component={TypographyComponent.Heading1}
      >
        {t('viewNewsPage.title')}
      </Typography>
      <div className={styles.contentWrapper}>
        {renderImage()}
        {renderContent()}
        {renderActions()}
      </div>
    </section>
  );
});
