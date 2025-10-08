const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const router = express.Router();

// Генерация PKCE параметров
function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  return { codeVerifier, codeChallenge };
}

// Генерация state
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

// Страница входа
router.get('/login', (req, res) => {
  res.render('login', { title: 'Вход в систему' });
});

// Авторизация через новый API ВК
router.get('/auth/vk', (req, res) => {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = generateState();
  
  // Сохраняем в сессии для проверки
  req.session.codeVerifier = codeVerifier;
  req.session.state = state;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.VK_APP_ID,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: process.env.VK_CALLBACK_URL,
    scope: 'email photos wall friends',
    state: state
  });
  
  const authUrl = `https://id.vk.ru/authorize?${params}`;
  res.redirect(authUrl);
});

// Callback обработка
router.get('/auth/vk/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Проверяем state
  if (state !== req.session.state) {
    return res.redirect('/login?error=invalid_state');
  }
  
  try {
    // Обмениваем код на токен
    const tokenResponse = await fetch('https://id.vk.ru/oauth2/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        code_verifier: req.session.codeVerifier,
        client_id: process.env.VK_APP_ID,
        redirect_uri: process.env.VK_CALLBACK_URL,
        state: state
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      // Получаем информацию о пользователе
      const userResponse = await fetch(`https://api.vk.com/method/users.get?access_token=${tokenData.access_token}&v=5.131&fields=photo_200`);
      const userData = await userResponse.json();
      
      const user = {
        id: userData.response[0].id,
        username: `${userData.response[0].first_name} ${userData.response[0].last_name}`,
        email: tokenData.email || '',
        photo: userData.response[0].photo_200 || '',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token
      };
      
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      console.error('Ошибка получения токена:', tokenData);
      res.redirect('/login?error=token_exchange_failed');
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// Выход из системы
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Ошибка при выходе:', err);
    }
    res.redirect('/');
  });
});

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

module.exports = { router, isAuthenticated };
