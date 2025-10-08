const passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const crypto = require('crypto');

// Генерация PKCE параметров
function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  return { codeVerifier, codeChallenge };
}

// Настройка стратегии ВКонтакте
passport.use(new VKontakteStrategy({
  clientID: process.env.VK_APP_ID,
  clientSecret: process.env.VK_APP_SECRET,
  callbackURL: process.env.VK_CALLBACK_URL || "http://localhost:3000/auth/vk/callback",
  scope: ['email', 'photos', 'wall', 'friends'],
  // Используем новый API ВК
  authorizationURL: 'https://id.vk.ru/authorize',
  tokenURL: 'https://id.vk.ru/oauth2/auth'
}, (accessToken, refreshToken, params, profile, done) => {
  // Здесь обычно происходит сохранение пользователя в БД
  // Пока используем простую структуру в памяти
  const user = {
    id: profile.id,
    username: profile.displayName,
    email: params.email || '',
    photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
    accessToken: accessToken,
    refreshToken: refreshToken
  };
  
  return done(null, user);
}));

// Сериализация пользователя для сессии
passport.serializeUser((user, done) => {
  done(null, user);
});

// Десериализация пользователя из сессии
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
