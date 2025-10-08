const axios = require('axios');

class VKIntegration {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiUrl = 'https://api.vk.com/method';
    this.apiVersion = '5.131';
  }

  // Получение информации о пользователе
  async getUserInfo() {
    try {
      const response = await axios.get(`${this.apiUrl}/users.get`, {
        params: {
          access_token: this.accessToken,
          v: this.apiVersion,
          fields: 'photo_200,email'
        }
      });
      return response.data.response[0];
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      throw error;
    }
  }

  // Публикация записи на стену пользователя
  async postToWall(message, attachments = '') {
    try {
      const response = await axios.post(`${this.apiUrl}/wall.post`, null, {
        params: {
          access_token: this.accessToken,
          v: this.apiVersion,
          message: message,
          attachments: attachments
        }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка публикации на стену:', error);
      throw error;
    }
  }

  // Получение списка друзей
  async getFriends() {
    try {
      const response = await axios.get(`${this.apiUrl}/friends.get`, {
        params: {
          access_token: this.accessToken,
          v: this.apiVersion,
          fields: 'photo_100'
        }
      });
      return response.data.response.items;
    } catch (error) {
      console.error('Ошибка получения списка друзей:', error);
      throw error;
    }
  }

  // Поделиться книгой в ВК
  async shareBook(bookTitle, bookAuthor, review = '') {
    const message = `📚 Прочитал книгу "${bookTitle}" от ${bookAuthor}\n\n${review}\n\n#книги #чтение`;
    return await this.postToWall(message);
  }

  // Поделиться отзывом о книге
  async shareReview(bookTitle, rating, review) {
    const stars = '⭐'.repeat(rating);
    const message = `📖 Отзыв о книге "${bookTitle}"\n\nОценка: ${stars} (${rating}/5)\n\n${review}\n\n#отзыв #книги`;
    return await this.postToWall(message);
  }
}

module.exports = VKIntegration;
