const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка сессий
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true для HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  }
}));

// Middleware для парсинга данных
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Настройка шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware для передачи данных пользователя в шаблоны
app.use((req, res, next) => {
  const token = req.cookies.authToken;
  
  if (token) {
    const { verifyToken } = require('./modules/auth');
    const user = verifyToken(token);
    if (user) {
      req.user = user;
      res.locals.user = user;
    }
  }
  
  next();
});

// Подключение маршрутов
app.use('/', require('./routes/auth').router);
app.use('/', require('./routes/books').router);
app.use('/', require('./routes/api'));

// Главная страница
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Книжный клуб',
    user: req.user 
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: 'Что-то пошло не так!',
    message: err.message 
  });
});

// 404 страница
app.use((req, res) => {
  res.status(404).render('error', { 
    error: 'Страница не найдена',
    message: 'Запрашиваемая страница не существует' 
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте http://localhost:${PORT} в браузере`);
});
