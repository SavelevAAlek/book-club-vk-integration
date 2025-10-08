const express = require('express');
const { isAuthenticated } = require('./auth');
const VKIntegration = require('../modules/vkIntegration');
const router = express.Router();

// Поделиться книгой в ВК
router.post('/api/share/book/:id', isAuthenticated, async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const { review } = req.body;
    
    // Находим книгу (в реальном проекте из БД)
    const { books } = require('./books');
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }
    
    const vk = new VKIntegration(req.session.user.accessToken);
    const result = await vk.shareBook(book.title, book.author, review);
    
    res.json({ 
      success: true, 
      message: 'Книга успешно опубликована в ВКонтакте!',
      postId: result.response.post_id 
    });
  } catch (error) {
    console.error('Ошибка при публикации в ВК:', error);
    res.status(500).json({ 
      error: 'Ошибка при публикации в ВКонтакте',
      details: error.message 
    });
  }
});

// Поделиться отзывом в ВК
router.post('/api/share/review/:id', isAuthenticated, async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const userId = req.session.user.id;
    
    // Получаем отзыв пользователя
    const { reviews, books } = require('./books');
    const userReview = reviews[userId] && reviews[userId][bookId];
    
    if (!userReview) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }
    
    // Находим книгу
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }
    
    const vk = new VKIntegration(req.session.user.accessToken);
    const result = await vk.shareReview(book.title, userReview.rating, userReview.review);
    
    res.json({ 
      success: true, 
      message: 'Отзыв успешно опубликован в ВКонтакте!',
      postId: result.response.post_id 
    });
  } catch (error) {
    console.error('Ошибка при публикации отзыва в ВК:', error);
    res.status(500).json({ 
      error: 'Ошибка при публикации в ВКонтакте',
      details: error.message 
    });
  }
});

// Получить информацию о пользователе ВК
router.get('/api/vk/user', isAuthenticated, async (req, res) => {
  try {
    const vk = new VKIntegration(req.session.user.accessToken);
    const userInfo = await vk.getUserInfo();
    
    res.json({ 
      success: true, 
      user: userInfo 
    });
  } catch (error) {
    console.error('Ошибка получения информации о пользователе ВК:', error);
    res.status(500).json({ 
      error: 'Ошибка получения информации о пользователе',
      details: error.message 
    });
  }
});

// Получить друзей пользователя ВК
router.get('/api/vk/friends', isAuthenticated, async (req, res) => {
  try {
    const vk = new VKIntegration(req.session.user.accessToken);
    const friends = await vk.getFriends();
    
    res.json({ 
      success: true, 
      friends: friends.slice(0, 20) // Ограничиваем до 20 друзей
    });
  } catch (error) {
    console.error('Ошибка получения списка друзей ВК:', error);
    res.status(500).json({ 
      error: 'Ошибка получения списка друзей',
      details: error.message 
    });
  }
});

module.exports = router;
