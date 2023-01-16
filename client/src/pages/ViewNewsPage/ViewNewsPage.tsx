import { useLocation, useNavigate, useParams } from 'react-router';
import classNames from 'classnames';

import {
  Button,
  ButtonVariant,
  Typography,
  TypographyComponent,
} from 'components';
import { useNewsArticleQuery } from 'hooks';
import { NotFoundPage } from 'pages';

import styles from './ViewNewsPage.module.scss';
import defaultImage from 'assets/images/default-background-blue.jpg';

export const ViewNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { newsArticle, isLoading } = useNewsArticleQuery(id!);

  const handleBack = (): void => navigate(-1);
  const handleEdit = (): void => navigate(pathname + '/edit');

  if (isLoading || newsArticle === undefined) {
    return <div>Загрузка...</div>;
  }

  if (newsArticle === null) {
    return <NotFoundPage />;
  }

  const { imageUrl, title, text } = newsArticle;

  const renderImage = (): JSX.Element => {
    return (
      <figure className={classNames(styles.section, styles.imageWrapper)}>
        <img
          className={styles.image}
          src={imageUrl ?? defaultImage}
          alt="Изображение новости"
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
        <Button variant={ButtonVariant.Default} onClick={handleBack}>
          Назад
        </Button>
        <div className={styles.actionGroup}>
          <Button 
            variant={ButtonVariant.Secondary} 
            onClick={handleEdit}
          >
            Редактировать
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.container}>
      <Typography
        className={styles.heading}
        component={TypographyComponent.Heading1}
      >
        Просмотр новости
      </Typography>
      <div className={styles.contentWrapper}>
        {renderImage()}
        {renderContent()}
        {renderActions()}
      </div>
    </section>
  );
};