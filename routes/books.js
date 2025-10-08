const express = require('express');
const { isAuthenticated } = require('./auth');
const VKIntegration = require('../modules/vkIntegration');
const router = express.Router();

// Временное хранилище книг (в реальном проекте будет БД)
const books = [
  {
    id: 1,
    title: '1984',
    author: 'Джордж Оруэлл',
    genre: 'Антиутопия',
    year: 1949,
    description: 'Роман-антиутопия о тоталитарном обществе будущего.'
  },
  {
    id: 2,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    genre: 'Мистика',
    year: 1967,
    description: 'Философский роман о добре и зле, любви и предательстве.'
  },
  {
    id: 3,
    title: 'Гарри Поттер и философский камень',
    author: 'Дж. К. Роулинг',
    genre: 'Фэнтези',
    year: 1997,
    description: 'Первая книга о юном волшебнике Гарри Поттере.'
  }
];

const userBooks = {}; // userBooks[userId] = [bookId1, bookId2, ...]
const reviews = {}; // reviews[userId] = { bookId: { rating, review, date } }
// Комментарии к книгам: bookComments[bookId] = [{ userId, username, text, date }]
const bookComments = {};

// Дашборд пользователя
router.get('/dashboard', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const userBookIds = userBooks[userId] || [];
  const userBookList = books.filter(book => userBookIds.includes(book.id));
  const userReviews = reviews[userId] || {};

  res.render('dashboard', {
    title: 'Мой профиль',
    user: req.user,
    books: userBookList,
    reviews: userReviews,
    allBooks: books
  });
});

// Страница со всеми книгами
router.get('/books', (req, res) => {
  res.render('books', {
    title: 'Каталог книг',
    books: books,
    user: req.user
  });
});

// Страница книги с обсуждением
router.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).render('error', {
      error: 'Книга не найдена',
      message: 'Запрашиваемая книга не существует'
    });
  }

  const comments = bookComments[bookId] || [];
  res.render('book', {
    title: book.title,
    book,
    comments,
    user: req.user
  });
});

// Добавить комментарий к книге
router.post('/books/:id/comments', isAuthenticated, (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).render('error', {
      error: 'Книга не найдена',
      message: 'Запрашиваемая книга не существует'
    });
  }

  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.redirect(`/books/${bookId}`);
  }
  if (!bookComments[bookId]) bookComments[bookId] = [];
  bookComments[bookId].push({
    userId: req.user.id,
    username: req.user.username,
    text: text.trim(),
    date: new Date().toISOString()
  });
  res.redirect(`/books/${bookId}`);
});

// Добавить книгу в прочитанные
router.post('/books/:id/add', isAuthenticated, (req, res) => {
  const bookId = parseInt(req.params.id);
  const userId = req.user.id;
  
  if (!userBooks[userId]) {
    userBooks[userId] = [];
  }
  
  if (!userBooks[userId].includes(bookId)) {
    userBooks[userId].push(bookId);
  }
  
  res.redirect('/dashboard');
});

// Удалить книгу из прочитанных
router.post('/books/:id/remove', isAuthenticated, (req, res) => {
  const bookId = parseInt(req.params.id);
  const userId = req.user.id;
  
  if (userBooks[userId]) {
    userBooks[userId] = userBooks[userId].filter(id => id !== bookId);
  }
  
  res.redirect('/dashboard');
});

// Страница отзыва о книге
router.get('/books/:id/review', isAuthenticated, (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return res.status(404).render('error', { 
      error: 'Книга не найдена',
      message: 'Запрашиваемая книга не существует' 
    });
  }
  
  const userId = req.user.id;
  const existingReview = reviews[userId] && reviews[userId][bookId];
  
  res.render('review', {
    title: `Отзыв о книге "${book.title}"`,
    book: book,
    user: req.user,
    existingReview: existingReview
  });
});

// Сохранить отзыв
router.post('/books/:id/review', isAuthenticated, (req, res) => {
  const bookId = parseInt(req.params.id);
  const userId = req.user.id;
  const { rating, review } = req.body;
  
  if (!reviews[userId]) {
    reviews[userId] = {};
  }
  
  reviews[userId][bookId] = {
    rating: parseInt(rating),
    review: review,
    date: new Date().toISOString()
  };
  
  res.redirect('/dashboard');
});

// Экспорт данных для использования в других модулях
module.exports = { router, books, userBooks, reviews };
