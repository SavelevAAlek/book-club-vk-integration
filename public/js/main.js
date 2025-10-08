// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модального окна
    initModal();
    
    // Инициализация рейтинга
    initRating();
    
    // Инициализация кнопок поделиться
    initShareButtons();
});

// Модальное окно для поделиться
function initModal() {
    const modal = document.getElementById('shareModal');
    const shareBtns = document.querySelectorAll('.share-btn, .share-review-btn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelShare');
    const shareForm = document.getElementById('shareForm');
    
    if (!modal) return;
    
    // Открытие модального окна
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            const isReview = this.classList.contains('share-review-btn');
            
            // Устанавливаем правильный endpoint
            shareForm.action = isReview ? 
                `/api/share/review/${bookId}` : 
                `/api/share/book/${bookId}`;
            
            // Обновляем заголовок
            const title = modal.querySelector('h3');
            title.textContent = isReview ? 
                'Поделиться отзывом в ВКонтакте' : 
                'Поделиться книгой в ВКонтакте';
            
            modal.style.display = 'block';
        });
    });
    
    // Закрытие модального окна
    function closeModal() {
        modal.style.display = 'none';
        shareForm.reset();
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Отправка формы
    shareForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const url = this.action;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message, 'success');
                closeModal();
            } else {
                showNotification(result.error || 'Ошибка при публикации', 'error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Ошибка при публикации в ВКонтакте', 'error');
        }
    });
}

// Инициализация рейтинга
function initRating() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    
    ratingInputs.forEach(ratingInput => {
        const stars = ratingInput.querySelectorAll('.star-label');
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', function() {
                highlightStars(stars, index);
            });
            
            star.addEventListener('click', function() {
                const radio = ratingInput.querySelector(`input[value="${index + 1}"]`);
                if (radio) {
                    radio.checked = true;
                }
            });
        });
        
        ratingInput.addEventListener('mouseleave', function() {
            const checkedStar = ratingInput.querySelector('input:checked');
            if (checkedStar) {
                const checkedIndex = parseInt(checkedStar.value) - 1;
                highlightStars(stars, checkedIndex);
            } else {
                clearStars(stars);
            }
        });
    });
}

// Подсветка звезд
function highlightStars(stars, index) {
    stars.forEach((star, i) => {
        if (i <= index) {
            star.style.color = '#ffc107';
        } else {
            star.style.color = '#ddd';
        }
    });
}

// Очистка звезд
function clearStars(stars) {
    stars.forEach(star => {
        star.style.color = '#ddd';
    });
}

// Инициализация кнопок поделиться
function initShareButtons() {
    // Кнопки уже инициализированы в initModal()
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Удаление через 5 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Анимация появления карточек
function animateCards() {
    const cards = document.querySelectorAll('.book-card, .feature-card, .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Инициализация анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', animateCards);

// Обработка ошибок AJAX
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('Произошла ошибка при выполнении запроса', 'error');
});

// Утилиты
const utils = {
    // Форматирование даты
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Обрезка текста
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // Проверка авторизации
    isAuthenticated: function() {
        return document.querySelector('.user-menu') !== null;
    }
};

// Экспорт для использования в других скриптах
window.BookApp = {
    showNotification,
    utils
};
