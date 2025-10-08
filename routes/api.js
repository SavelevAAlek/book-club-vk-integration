const express = require('express');
const { isAuthenticated } = require('./auth');
const VKIntegration = require('../modules/vkIntegration');
const router = express.Router();

// Поделиться книгой в ВК
// Эндпоинты публикации в ВК удалены

// Поделиться отзывом в ВК
// Эндпоинты публикации в ВК удалены

// Получить информацию о пользователе ВК
router.get('/api/vk/user', isAuthenticated, async (req, res) => {
  try {
    const vk = new VKIntegration(req.user.accessToken);
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
    const vk = new VKIntegration(req.user.accessToken);
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
