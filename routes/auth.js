const express = require('express');
const passport = require('passport');
const router = express.Router();

// Страница входа
router.get('/login', (req, res) => {
  res.render('login', { title: 'Вход в систему' });
});

// Авторизация через ВКонтакте
router.get('/auth/vk', 
  passport.authenticate('vkontakte', {
    scope: ['email', 'photos']
  })
);

// Callback после авторизации ВК
router.get('/auth/vk/callback',
  passport.authenticate('vkontakte', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Успешная авторизация
    res.redirect('/dashboard');
  }
);

// Выход из системы
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Ошибка при выходе:', err);
    }
    res.redirect('/');
  });
});

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = { router, isAuthenticated };
