import express from 'express';
import faker from 'faker';
import { ensureAuthenticated } from '../ensureAthenticated.mjs';
import { isModerator } from '../isModerator.mjs';

export const newsRoutes = (db) => {
  const newsRouter = express.Router();
  
  newsRouter.get('/', (req, res) => {
    res.json(db.data.news);
  });

  newsRouter.get('/:id', (req, res) => {
    const newsId = req.params.id;
  
    const news = db.data.news.find(n => n.id === newsId);
  
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
  
    res.json(news);
  });

  newsRouter.post('/', ensureAuthenticated, isModerator, async (req, res) => {
    try {
      const {
        title,
        text,
        image
      } = req.body;

      if (!title || !text) {
        return res.status(400).json({ message: 'Invalid request data' });
      }

      const news = {
        id: faker.datatype.uuid(),
        publicationDate: new Date().toISOString(),
        title,
        text,
        image: image || null
      };

      db.data.news.push(news);

      await db.write();
      res.json(news);
    } catch (e) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  newsRouter.put('/:id', ensureAuthenticated, isModerator, async (req, res) => {
    try {
      const newsId = req.params.id;
      const index = db.data.news.findIndex(n => n.id === newsId);

      if (!(index >= 0)) {
        return res.status(404).json({ message: 'News not found' });
      }

      const news = db.data.news[index];

      const title = req.body.title || news.title;
      const text = req.body.text || news.text;
      const image = req.body.image || news.image;

      db.data.news[index] = {
        ...db.data.news[index],
        title,
        text,
        image
      };

      await db.write();
      res.json(db.data.news[index]);
    } catch (e) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  newsRouter.delete('/:id', ensureAuthenticated, isModerator, async (req, res) => {
    try {
      const newsId = req.params.id;

      const index = db.data.news.findIndex(n => n.id === newsId);

      if (!(index >= 0)) {
        return res.status(404).json({ message: 'News not found' });
      }

      db.data.news.splice(index, 1);

      await db.write();
      res.send(db.data.news);
    } catch (e) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  return newsRouter;
}
