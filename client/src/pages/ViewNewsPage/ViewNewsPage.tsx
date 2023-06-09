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
import { NotFoundPage } from 'pages';
import { useAuthStore, useNewsArticle, useNewsStore } from 'hooks';
import { Optional } from 'types';

import styles from './ViewNewsPage.module.scss';
import defaultImage from 'assets/images/default-background-blue.jpg';

export const ViewNewsPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const newsStore = useNewsStore();
  const newsArticle = useNewsArticle(id);
  const { t } = useTranslation();
  const { loggedUser } = useAuthStore();

  let isLoading: boolean;
  let isError: Optional<boolean>;

  isLoading = newsArticle?.isLoading ?? newsStore.isLoading;

  if (newsStore.isInitialized && !newsArticle) {
    isError = true;
  } else {
    isError = newsArticle?.isError;
  }

  if (isLoading) {
    return <LoadingSpinner text={t('loadingText.newsArticle')} />;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  if (!newsArticle) {
    return null;
  }

  const { image, title, text } = newsArticle;

  const handleBack = (): void => navigate(-1);
  const handleEdit = (): void => navigate(pathname + '/edit');

  const renderImage = (): JSX.Element => {
    return (
      <figure
        className={classNames(styles.section, styles.imageWrapper)}
        data-testid="image"
      >
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
        data-testid="title"
      >
        {title}
      </Typography>
      <Typography
        className={styles.text}
        component={TypographyComponent.Paragraph}
        data-testid="text"
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
        {loggedUser?.isAdmin ? (
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
    <section className={styles.container} data-testid="news-page">
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
