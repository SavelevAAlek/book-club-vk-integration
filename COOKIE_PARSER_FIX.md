# Исправление ошибки "Cannot read properties of undefined (reading 'authToken')"

## 🚨 **Проблема:**
Ошибка `Cannot read properties of undefined (reading 'authToken')` возникает потому, что мы пытаемся прочитать `req.cookies.authToken`, но `req.cookies` не определен.

## ✅ **Решение:**

### 1. **Установлен cookie-parser:**
```bash
npm install cookie-parser
```

### 2. **Добавлен middleware в server.js:**
```javascript
const cookieParser = require('cookie-parser');
// ...
app.use(cookieParser());
```

### 3. **Добавлена отладка cookies:**
```javascript
app.use((req, res, next) => {
  console.log('Cookies:', req.cookies);
  // ... остальной код
});
```

## 🚀 **Следующие шаги:**

### 1. **Добавьте переменные в Vercel:**
- `JWT_SECRET` - случайная строка для подписи JWT
- `NODE_ENV=production` - для правильной работы cookies

### 2. **Переразверните проект:**
```bash
git add .
git commit -m "Add cookie-parser middleware and debugging"
git push
```

### 3. **Проверьте логи в Vercel:**
- Перейдите в панель Vercel
- Выберите проект → Functions → View Function Logs
- Протестируйте авторизацию и посмотрите логи

### 4. **Проверьте cookies в браузере:**
- Откройте DevTools (F12)
- Application → Cookies
- Проверьте, есть ли cookies `authToken`, `codeVerifier`, `state`

## 🔍 **Что покажут логи:**

После исправления в логах должно быть:
1. **Cookies:** `{ authToken: '...', codeVerifier: '...', state: '...' }`
2. **Пользователь авторизован:** `Имя Фамилия`
3. **Или:** `Токен отсутствует` / `Недействительный токен`

## 📝 **Проверочный список:**

- [ ] `cookie-parser` установлен
- [ ] `cookieParser()` middleware добавлен в server.js
- [ ] `JWT_SECRET` установлен в Vercel
- [ ] `NODE_ENV=production` установлен в Vercel
- [ ] Проект переразвернут
- [ ] Логи проверены
- [ ] Cookies проверены в браузере

## 🎯 **Ожидаемый результат:**

После исправления:
- ✅ Cookies правильно парсятся
- ✅ JWT токены читаются из cookies
- ✅ Пользователь остается авторизованным
- ✅ Ошибка "Cannot read properties of undefined" исчезает
