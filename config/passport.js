const passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

// Настройка стратегии ВКонтакте
passport.use(new VKontakteStrategy({
  clientID: process.env.VK_APP_ID,
  clientSecret: process.env.VK_APP_SECRET,
  callbackURL: process.env.VK_CALLBACK_URL || "http://localhost:3000/auth/vk/callback",
  scope: ['email', 'photos', 'wall', 'friends']
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
