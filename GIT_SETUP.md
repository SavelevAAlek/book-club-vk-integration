# Инструкция по добавлению проекта в Git

## 🎯 Цель
Добавить проект "Книжный клуб" в Git репозиторий для сохранения кода и удобного развертывания на Vercel.

## 📋 Что нужно сделать
1. ✅ Инициализировать Git репозиторий
2. ✅ Добавить файлы в репозиторий
3. ✅ Создать первый коммит
4. ✅ Создать репозиторий на GitHub
5. ✅ Подключить локальный репозиторий к GitHub
6. ✅ Загрузить код на GitHub

---

## 🚀 ШАГ 1: Инициализация Git репозиторий

### 1.1 Открытие терминала
1. Откройте терминал в папке с проектом
2. Убедитесь, что вы находитесь в корневой папке проекта (где находится `package.json`)

### 1.2 Инициализация репозитория
```bash
git init
```

### 1.3 Проверка статуса
```bash
git status
```
Вы должны увидеть список файлов проекта.

---

## 📁 ШАГ 2: Создание .gitignore файла

### 2.1 Создание файла .gitignore
Создайте файл `.gitignore` в корне проекта со следующим содержимым:

```gitignore
# Зависимости
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Переменные окружения
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Логи
logs
*.log

# Временные файлы
.tmp/
.cache/

# IDE файлы
.vscode/
.idea/
*.swp
*.swo

# OS файлы
.DS_Store
Thumbs.db

# Vercel
.vercel
```

### 2.2 Создание файла через терминал
```bash
echo "# Зависимости
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Переменные окружения
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Логи
logs
*.log

# Временные файлы
.tmp/
.cache/

# IDE файлы
.vscode/
.idea/
*.swp
*.swo

# OS файлы
.DS_Store
Thumbs.db

# Vercel
.vercel" > .gitignore
```

---

## 📝 ШАГ 3: Добавление файлов в репозиторий

### 3.1 Добавление всех файлов
```bash
git add .
```

### 3.2 Проверка добавленных файлов
```bash
git status
```
Вы должны увидеть файлы в разделе "Changes to be committed".

---

## 💾 ШАГ 4: Создание первого коммита

### 4.1 Создание коммита
```bash
git commit -m "Initial commit: Book Club project with VK integration"
```

### 4.2 Проверка коммита
```bash
git log --oneline
```
Вы должны увидеть ваш коммит.

---

## 🌐 ШАГ 5: Создание репозитория на GitHub

### 5.1 Переход на GitHub
1. Перейдите на **https://github.com**
2. Войдите в свой аккаунт или создайте новый

### 5.2 Создание нового репозитория
1. Нажмите **"New"** или **"+"** → **"New repository"**
2. Заполните форму:
   - **Repository name**: `book-club-vk-integration`
   - **Description**: `Курсовой проект: Модуль интеграции с социальными сетями`
   - **Visibility**: `Public` (для бесплатного использования)
   - **НЕ** добавляйте README, .gitignore или лицензию (они уже есть)
3. Нажмите **"Create repository"**

### 5.3 Получение URL репозитория
После создания репозитория GitHub покажет URL. Он будет выглядеть так:
```
https://github.com/ваш-username/book-club-vk-integration.git
```

---

## 🔗 ШАГ 6: Подключение к GitHub

### 6.1 Добавление удаленного репозитория
```bash
git remote add origin https://github.com/ваш-username/book-club-vk-integration.git
```

**Замените `ваш-username` на ваш реальный username на GitHub!**

### 6.2 Проверка подключения
```bash
git remote -v
```
Вы должны увидеть URL вашего репозитория.

---

## 📤 ШАГ 7: Загрузка кода на GitHub

### 7.1 Переименование основной ветки (опционально)
```bash
git branch -M main
```

### 7.2 Загрузка кода
```bash
git push -u origin main
```

### 7.3 Ввод учетных данных
Если потребуется авторизация:
1. Введите ваш **username** на GitHub
2. Введите ваш **Personal Access Token** (не пароль!)

---

## 🔑 ШАГ 8: Создание Personal Access Token (если нужно)

### 8.1 Переход к настройкам
1. На GitHub перейдите в **Settings** → **Developer settings**
2. Выберите **Personal access tokens** → **Tokens (classic)**

### 8.2 Создание токена
1. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
2. Заполните форму:
   - **Note**: `Book Club Project`
   - **Expiration**: `No expiration` (или выберите срок)
   - **Scopes**: выберите `repo` (полный доступ к репозиториям)
3. Нажмите **"Generate token"**
4. **ВАЖНО**: Скопируйте токен и сохраните его!

---

## ✅ ШАГ 9: Проверка загрузки

### 9.1 Проверка на GitHub
1. Перейдите на страницу вашего репозитория
2. Убедитесь, что все файлы загружены
3. Проверьте, что README.md отображается корректно

### 9.2 Проверка локально
```bash
git status
```
Должно показать "Your branch is up to date with 'origin/main'".

---

## 🚀 ШАГ 10: Развертывание через GitHub на Vercel

### 10.1 Подключение GitHub к Vercel
1. Перейдите на **https://vercel.com**
2. Нажмите **"New Project"**
3. Выберите **"Import Git Repository"**
4. Найдите ваш репозиторий `book-club-vk-integration`
5. Нажмите **"Import"**

### 10.2 Настройка проекта
1. **Project Name**: оставьте предложенное
2. **Framework Preset**: `Other`
3. **Root Directory**: `./`
4. Нажмите **"Deploy"**

### 10.3 Преимущества GitHub интеграции
- ✅ **Автоматические обновления** - при каждом push в GitHub
- ✅ **История изменений** - все коммиты сохраняются
- ✅ **Резервное копирование** - код всегда в безопасности
- ✅ **Совместная работа** - можно работать в команде

---

## 🔄 Полезные команды Git

### Основные команды
```bash
# Проверка статуса
git status

# Добавление файлов
git add .
git add filename.txt

# Создание коммита
git commit -m "Описание изменений"

# Загрузка на GitHub
git push

# Получение обновлений
git pull

# Просмотр истории
git log --oneline
```

### Работа с ветками
```bash
# Создание новой ветки
git checkout -b feature/new-feature

# Переключение между ветками
git checkout main
git checkout feature/new-feature

# Слияние веток
git checkout main
git merge feature/new-feature
```

---

## 🚨 Решение проблем

### Ошибка "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/ваш-username/book-club-vk-integration.git
```

### Ошибка авторизации
1. Убедитесь, что используете Personal Access Token, а не пароль
2. Проверьте правильность username

### Ошибка "fatal: not a git repository"
```bash
git init
```

### Ошибка "nothing to commit"
```bash
git add .
git commit -m "Your commit message"
```

---

## 📝 Чек-лист

- [ ] Git репозиторий инициализирован
- [ ] Создан файл .gitignore
- [ ] Все файлы добавлены в репозиторий
- [ ] Создан первый коммит
- [ ] Создан репозиторий на GitHub
- [ ] Локальный репозиторий подключен к GitHub
- [ ] Код загружен на GitHub
- [ ] Репозиторий подключен к Vercel
- [ ] Проект развернут на Vercel через GitHub

---

## 🎉 Готово!

Теперь у вас есть:
- ✅ **Git репозиторий** с полной историей изменений
- ✅ **GitHub репозиторий** для хранения кода
- ✅ **Автоматическое развертывание** на Vercel
- ✅ **Резервное копирование** кода

**Ссылка на ваш репозиторий**: `https://github.com/ваш-username/book-club-vk-integration`

Теперь при каждом изменении кода просто выполните:
```bash
git add .
git commit -m "Описание изменений"
git push
```

И Vercel автоматически обновит ваш сайт!
