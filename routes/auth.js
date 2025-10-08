const express = require('express');
const crypto = require('crypto');
const { createToken, verifyToken } = require('../modules/auth');
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
  
  // Сохраняем в cookies для проверки (вместо сессий)
  res.cookie('codeVerifier', codeVerifier, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000 // 10 минут
  });
  res.cookie('state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000 // 10 минут
  });
  
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
  
  console.log('Callback получен:', { code: code?.substring(0, 20) + '...', state });
  console.log('Cookie state:', req.cookies.state);
  
  // Проверяем state
  if (state !== req.cookies.state) {
    console.error('State не совпадает:', { received: state, expected: req.cookies.state });
    return res.redirect('/login?error=invalid_state');
  }
  
  try {
    console.log('Обмениваем код на токен...');
    
    // Обмениваем код на токен
    const tokenResponse = await fetch('https://id.vk.ru/oauth2/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        code_verifier: req.cookies.codeVerifier,
        client_id: process.env.VK_APP_ID,
        redirect_uri: process.env.VK_CALLBACK_URL,
        state: state
      })
    });
    
    const tokenData = await tokenResponse.json();
    console.log('Ответ токена:', tokenData);
    
    if (tokenData.access_token) {
      console.log('Получаем информацию о пользователе...');
      
      // Получаем информацию о пользователе
      const userResponse = await fetch(`https://api.vk.com/method/users.get?access_token=${tokenData.access_token}&v=5.131&fields=photo_200`);
      const userData = await userResponse.json();
      console.log('Данные пользователя:', userData);
      
      const user = {
        id: userData.response[0].id,
        username: `${userData.response[0].first_name} ${userData.response[0].last_name}`,
        email: tokenData.email || '',
        photo: userData.response[0].photo_200 || '',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token
      };
      
      console.log('Создаем JWT токен для пользователя:', user);
      
      // Создаем JWT токен
      const jwtToken = createToken(user);
      
      // Сохраняем токен в cookie
      res.cookie('authToken', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
      });
      
      // Очищаем временные cookies
      res.clearCookie('codeVerifier');
      res.clearCookie('state');
      
      console.log('JWT токен сохранен, перенаправляем на dashboard');
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
  res.clearCookie('authToken');
  res.redirect('/');
});

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.redirect('/login');
  }
  
  const user = verifyToken(token);
  if (!user) {
    res.clearCookie('authToken');
    return res.redirect('/login');
  }
  
  req.user = user;
  next();
};

module.exports = { router, isAuthenticated };
