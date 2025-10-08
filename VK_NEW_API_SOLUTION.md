# Решение проблемы с новым API ВК

## 🚨 **Проблема:**

ВК обновил API и теперь требует использование нового эндпоинта `id.vk.ru` вместо `oauth.vk.com`, а также PKCE для безопасности.

## ✅ **Решение:**

### Вариант 1: Обновить Passport.js стратегию

Код уже обновлен в `config/passport.js` с новыми URL:
- `authorizationURL: 'https://id.vk.ru/authorize'`
- `tokenURL: 'https://id.vk.ru/oauth2/auth'`

### Вариант 2: Использовать новый API напрямую

Если Passport.js не поддерживает новый API, можно реализовать авторизацию напрямую:

```javascript
// В routes/auth.js
const crypto = require('crypto');

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
      const userResponse = await fetch(`https://api.vk.com/method/users.get?access_token=${tokenData.access_token}&v=5.131`);
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
      res.redirect('/login?error=token_exchange_failed');
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.redirect('/login?error=auth_failed');
  }
});
```

## 🚀 **Рекомендуемые действия:**

### 1. **Попробуйте обновленный Passport.js**
- Код уже обновлен с новыми URL
- Переразверните проект на Vercel
- Протестируйте авторизацию

### 2. **Если не работает - используйте прямое API**
- Замените Passport.js на прямое обращение к API
- Реализуйте PKCE и state проверку
- Это более надежное решение

### 3. **Проверьте настройки приложения ВК**
- Убедитесь, что приложение поддерживает новый API
- Проверьте права доступа
- Убедитесь, что статус "Активно"

## 📝 **Что изменилось в ВК:**

1. **Новый эндпоинт**: `id.vk.ru` вместо `oauth.vk.com`
2. **PKCE обязателен**: `code_challenge` и `code_verifier`
3. **State проверка**: для защиты от CSRF
4. **Новый формат ответа**: JSON вместо URL параметров

## 🎯 **Следующие шаги:**

1. **Переразверните проект** с обновленным кодом
2. **Протестируйте авторизацию**
3. **Если не работает** - используйте прямое API
4. **Проверьте логи** в Vercel для отладки
