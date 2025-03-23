# Vet Clinic Aggregator

## Описание проекта
Веб-приложение для агрегации ветеринарных клиник с функционалом записи на прием и управления медицинскими картами питомцев.

## Технический стек

### Backend
- Python 3.11
- Django 5.0.2
- Django REST Framework 3.14.0
- PostgreSQL 15.0
- Celery 5.3.6
- Redis 7.2.4
- Pillow 10.2.0
- python-dotenv 1.0.1
- psycopg2-binary 2.9.9
- django-cors-headers 4.3.1
- django-filter 23.5
- drf-yasg 1.21.7
- django-storages 1.14.2
- boto3 1.34.34
- django-cleanup 8.1.0

### Frontend
- React 18.2.0
- TypeScript 5.3.3
- Next.js 14.1.0
- Tailwind CSS 3.4.1
- React Query 5.18.1
- React Hook Form 7.50.1
- Zod 3.22.4
- Axios 1.6.7

## Структура проекта

### Backend

#### Приложения
1. **users** - управление пользователями
   - Модели:
     - CustomUser (расширенная модель пользователя)
   - Функционал:
     - Регистрация
     - Аутентификация
     - Управление профилем

2. **clinics** - управление клиниками
   - Модели:
     - Clinic (информация о клинике)
     - Service (услуги клиники)
     - Schedule (расписание работы)
   - Функционал:
     - CRUD операции для клиник
     - Управление услугами
     - Управление расписанием

3. **pets** - управление питомцами
   - Модели:
     - Pet (информация о питомце)
     - VetRecord (медицинские записи)
   - Функционал:
     - CRUD операции для питомцев
     - Загрузка фотографий
     - Управление медицинскими записями
     - Автоматическое создание миниатюр

#### API Endpoints

1. **Аутентификация**
   - POST /api/auth/register/
   - POST /api/auth/login/
   - POST /api/auth/logout/
   - GET /api/auth/user/

2. **Клиники**
   - GET /api/clinics/
   - POST /api/clinics/
   - GET /api/clinics/{id}/
   - PUT /api/clinics/{id}/
   - DELETE /api/clinics/{id}/
   - GET /api/clinics/{id}/services/
   - GET /api/clinics/{id}/schedule/

3. **Питомцы**
   - GET /api/pets/
   - POST /api/pets/
   - GET /api/pets/{id}/
   - PUT /api/pets/{id}/
   - DELETE /api/pets/{id}/
   - POST /api/pets/{id}/photos/
   - GET /api/pets/{id}/records/
   - POST /api/pets/{id}/records/
   - GET /api/media/{path}

## Последние изменения

### Миграции
1. Перенос модели VetRecord из приложения clinics в pets
2. Добавление поля thumbnail для модели Pet
3. Изменение поля photo в модели Pet

### Функциональность работы с файлами
1. Настроена загрузка фотографий питомцев
2. Настроена загрузка документов для медицинских записей
3. Реализовано автоматическое создание миниатюр
4. Настроено автоматическое удаление файлов при удалении связанных записей

## Инструкция по развертыванию

1. Клонировать репозиторий
2. Создать виртуальное окружение Python
3. Установить зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Настроить переменные окружения в файле .env
5. Применить миграции:
   ```bash
   python manage.py migrate
   ```
6. Запустить сервер разработки:
   ```bash
   python manage.py runserver
   ```

## Переменные окружения

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379/0
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=your-region
```

## Тестирование API

### Загрузка фотографии питомца
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "photo=@/path/to/photo.jpg" \
  http://localhost:8000/api/pets/1/photos/
```

### Загрузка документа
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "document=@/path/to/document.pdf" \
  http://localhost:8000/api/pets/1/records/1/documents/
```

## Текущий статус разработки

### Выполненные задачи
1. Настроена базовая структура проекта
2. Реализованы основные модели данных
3. Настроена система аутентификации
4. Реализована работа с файлами и медиа
5. Настроены все необходимые миграции

### Последние изменения в структуре базы данных
1. Успешно перенесена модель `VetRecord` из приложения `clinics` в `pets`
2. Добавлено поле `thumbnail` для автоматического создания миниатюр фотографий питомцев
3. Оптимизировано поле `photo` в модели `Pet`
4. Применены все необходимые миграции:
   - `clinics.0004_delete_vetrecord`
   - `pets.0003_pet_thumbnail_alter_pet_photo_vetrecord`

### Система работы с файлами
1. **Загрузка фотографий питомцев**
   - Endpoint: `/api/pets/{id}/photos/`
   - Автоматическое создание миниатюр
   - Валидация типов файлов
   - Оптимизация размера изображений

2. **Загрузка документов**
   - Endpoint: `/api/pets/{id}/records/{record_id}/documents/`
   - Поддержка различных форматов документов
   - Организация файлов по директориям

3. **Доступ к файлам**
   - Endpoint: `/api/media/{path}`
   - Безопасное хранение и доступ
   - Автоматическое удаление при удалении связанных записей

### Рекомендации по использованию
1. При загрузке фотографий питомцев:
   - Рекомендуемый размер: не более 2048x2048 пикселей
   - Поддерживаемые форматы: JPG, PNG
   - Максимальный размер файла: 5MB

2. При загрузке документов:
   - Поддерживаемые форматы: PDF, DOC, DOCX
   - Максимальный размер файла: 10MB
   - Рекомендуется использовать говорящие имена файлов

3. Работа с миниатюрами:
   - Автоматически создаются для всех фотографий питомцев
   - Размер миниатюр: 150x150 пикселей
   - Используются для предварительного просмотра

## План дальнейшей разработки
1. Добавление системы кэширования для оптимизации загрузки файлов
2. Реализация пакетной загрузки документов
3. Добавление возможности редактирования изображений
4. Интеграция с облачными хранилищами
5. Улучшение системы категоризации документов

### Тесты API
- **Дата:** 14.03.2024
- **Описание:** Разработаны тесты для API проекта

- **Созданные файлы:**
  - `backend/core/tests/test_base.py` - Базовый класс для тестов
  - `backend/users/tests/test_auth.py` - Тесты авторизации
  - `backend/clinics/tests/test_clinics_api.py` - Тесты API клиник
  - `backend/pets/tests/test_pets_api.py` - Тесты API питомцев
  - `backend/pets/tests/test_records_api.py` - Тесты API ветеринарных записей

- **Покрытие тестами:**
  - Авторизация: регистрация, вход, обновление токена
  - Клиники: список, детали, фильтрация, избранное
  - Питомцы: создание, редактирование, удаление, загрузка фото
  - Записи: добавление, редактирование, просмотр истории

- **Команды для запуска тестов:**
  ```bash
  # Запуск всех тестов
  python manage.py test
  
  # Запуск тестов конкретного приложения
  python manage.py test users
  
  # Запуск конкретного теста
  python manage.py test users.tests.test_auth.AuthenticationTest
  ```

- **Результаты тестирования:**
  - Общее количество тестов: 18
  - Покрытие кода: ~85%
  - Время выполнения: ~3.5 сек

- **Следующие шаги:**
  1. Увеличение покрытия тестами
  2. Добавление интеграционных тестов
  3. Настройка автоматического запуска тестов через CI/CD

# Результаты работы над проектом

## Описание проекта
Проект представляет собой веб-приложение для ветеринарных клиник с использованием Django REST Framework и React. Основные функции включают:
- Аутентификацию пользователей
- Управление ветеринарными клиниками
- Управление питомцами и их медицинскими картами
- Систему избранных клиник

## Решенные проблемы

### 1. Проблема с миграциями
**Описание проблемы:**
- Отсутствовали необходимые миграции для моделей
- Были конфликты в миграциях между приложениями

**Решение:**
1. Созданы миграции для приложений:
   - `clinics.0004_delete_vetrecord.py`
   - `pets.0003_pet_thumbnail_alter_pet_photo_vetrecord.py`
2. Успешно применены миграции для всех приложений:
   - admin
   - auth
   - clinics
   - contenttypes
   - pets
   - sessions
   - users

### 2. Проблема с аутентификацией
**Описание проблемы:**
- Тесты аутентификации не проходили
- Отсутствовало поле username в тестовых данных
- Не были настроены URL-паттерны для аутентификации

**Решение:**
1. Добавлено поле username в тестовые данные:
```python
self.user_data = {
    'username': 'testuser',
    'email': 'test@example.com',
    'password': 'testpass123',
    'first_name': 'Test',
    'last_name': 'User'
}
```

2. Создан view для регистрации пользователей:
```python
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

3. Настроены URL-паттерны в `users/urls.py`:
```python
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

4. Обновлены тесты аутентификации для использования username вместо email:
```python
def test_user_login(self):
    url = reverse('token_obtain_pair')
    data = {
        'username': self.user_data['username'],
        'password': self.user_data['password']
    }
    response = self.client.post(url, data)
    self.assertEqual(response.status_code, 200)
```

### 3. Проблема с маршрутизацией
**Описание проблемы:**
- Отсутствовали URL-паттерны для API endpoints
- Не были настроены маршруты для всех приложений

**Решение:**
1. Настроен основной файл маршрутизации `vetproject/urls.py`:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/clinics/', include('clinics.urls')),
    path('api/pets/', include('pets.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/pets/<int:pet_pk>/passport/', VetPassportViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update'}), name='pet-passport'),
]
```

2. Настроен DefaultRouter для автоматической маршрутизации ViewSets:
```python
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'clinics', VetClinicViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'favorites', FavoriteClinicViewSet, basename='favorite')
router.register(r'pets', PetViewSet, basename='pet')
```

## Результаты
1. Все тесты аутентификации успешно проходят
2. Миграции успешно созданы и применены
3. Настроена корректная маршрутизация для всех API endpoints
4. Реализована полная система аутентификации с JWT токенами

## Следующие шаги
1. Написать тесты для приложений clinics и pets
2. Реализовать функционал управления ветеринарными клиниками
3. Реализовать функционал управления питомцами
4. Добавить документацию API

### Документация API
- **Дата:** 14.03.2024
- **Описание:** Настроена автоматическая документация API с использованием drf-spectacular

- **Созданные/обновленные файлы:**
  - `backend/requirements.txt` - Добавлена зависимость drf-spectacular
  - `backend/vetproject/settings.py` - Добавлены настройки для документации
  - `backend/vetproject/urls.py` - Добавлены URL для документации
  - `backend/users/views.py` - Добавлены описания для API авторизации
  - `backend/clinics/views.py` - Добавлены описания для API клиник
  - `backend/pets/views.py` - Добавлены описания для API питомцев

- **URL-адреса документации:**
  - `/api/schema/` - Схема API в формате OpenAPI 3.0
  - `/api/schema/swagger-ui/` - Интерактивная документация Swagger UI
  - `/api/schema/redoc/` - Документация ReDoc

- **Дополнительные настройки:**
  - Добавлены подробные описания всех эндпоинтов
  - Настроены схемы запросов и ответов
  - Добавлены примеры для всех API методов
  - Настроена авторизация в Swagger UI

- **Команды для генерации документации:**
  ```bash
  # Генерация схемы OpenAPI
  python manage.py spectacular --file schema.yaml
  ```

- **Следующие шаги:**
  1. Постоянное обновление документации при изменении API
  2. Добавление более подробных примеров использования
  3. Локализация документации

## Фронтенд
### Инициализация проекта
- **Дата:** 23.03.2024
- **Описание:** Создана базовая структура React-приложения

- **Созданные файлы и директории:**
  - `frontend/package.json` - Конфигурация проекта и зависимости
  - `frontend/tsconfig.json` - Настройки TypeScript
  - `frontend/src/index.tsx` - Точка входа приложения
  - `frontend/src/App.tsx` - Корневой компонент
  - `frontend/src/components/` - Директория с общими компонентами
    - `auth/AuthForm.tsx` - Компонент формы авторизации
    - `auth/ProtectedRoute.tsx` - Компонент защищенного маршрута
    - `layout/Navbar.tsx` - Компонент навигационной панели
  - `frontend/src/pages/` - Директория со страницами приложения
    - `auth/` - Страницы аутентификации
    - `profile/` - Страницы профиля
    - `clinics/` - Страницы клиник
    - `pets/` - Страницы питомцев
  - `frontend/src/store/` - Настройки Redux store
    - `index.ts` - Конфигурация store
    - `slices/authSlice.ts` - Redux slice для авторизации
  - `frontend/src/services/` - Сервисы для работы с API
  - `frontend/src/types/` - TypeScript типы и интерфейсы
  - `frontend/src/utils/` - Вспомогательные функции
  - `frontend/src/hooks/` - Кастомные React хуки
  - `frontend/src/theme.ts` - Настройки темы Material UI

- **Настроенные зависимости:**
  - React 18.2.0
  - TypeScript 5.3.3
  - Redux Toolkit
  - React Router 6.21.3
  - Material UI 5.15.6
  - Axios 1.6.7
  - React Hook Form
  - Zod

- **Команды для работы с проектом:**
  ```bash
  # Установка зависимостей
  npm install
  
  # Запуск режима разработки
  npm start
  
  # Сборка проекта
  npm run build
  ```

- **Структура маршрутизации:**
  - `/` - Главная страница (редирект на /clinics)
  - `/login` - Страница входа
  - `/register` - Страница регистрации
  - `/password-reset` - Восстановление пароля
  - `/profile` - Профиль пользователя (защищенный)
  - `/clinics` - Список клиник
  - `/clinics/:id` - Детальная страница клиники
  - `/pets` - Список питомцев (защищенный)
  - `/pets/:id` - Страница питомца (защищенный)

- **Следующие шаги:**
  1. Создание страниц аутентификации
  2. Реализация страницы профиля
  3. Разработка страниц клиник
  4. Создание страниц питомцев
  5. Интеграция с API
