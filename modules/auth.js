const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Создание JWT токена
function createToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      photo: user.photo,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
}

// Проверка JWT токена
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware для проверки авторизации
function isAuthenticated(req, res, next) {
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
}

module.exports = {
  createToken,
  verifyToken,
  isAuthenticated
};
