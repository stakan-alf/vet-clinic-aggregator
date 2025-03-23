# Руководство по развертыванию Django и React проекта

## 1. Подготовка сервера

### 1.1 Аренда сервера
1. Выберите провайдера (например, DigitalOcean, AWS, VK Cloud)
2. Создайте Ubuntu 22.04 LTS сервер с минимальными характеристиками:
   - 2 CPU
   - 4 GB RAM
   - 80 GB SSD
   - Ubuntu 22.04 LTS

### 1.2 Начальная настройка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y curl git build-essential

# Настройка часового пояса
sudo timedatectl set-timezone Europe/Moscow

# Создание пользователя для приложения
sudo adduser appuser
sudo usermod -aG sudo appuser
```

## 2. Установка Docker и Docker Compose

### 2.1 Установка Docker
```bash
# Установка зависимостей
sudo apt install -y apt-transport-https ca-certificates software-properties-common

# Добавление GPG ключа Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление репозитория Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Добавление пользователя в группу docker
sudo usermod -aG docker appuser
```

### 2.2 Установка Docker Compose
```bash
# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 3. Настройка Nginx

### 3.1 Установка Nginx
```bash
sudo apt install -y nginx
```

### 3.2 Конфигурация Nginx
Создайте файл конфигурации:
```bash
sudo nano /etc/nginx/sites-available/vet-clinic
```

Вставьте следующую конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.3 Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/vet-clinic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 4. Настройка SSL с Let's Encrypt

### 4.1 Установка Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Получение SSL-сертификата
```bash
sudo certbot --nginx -d your-domain.com
```

## 5. Настройка PostgreSQL

### 5.1 Создание Docker-контейнера для PostgreSQL
Создайте файл `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=vetclinic
      - POSTGRES_USER=vetclinic_user
      - POSTGRES_PASSWORD=your_secure_password
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 5.2 Запуск PostgreSQL
```bash
docker-compose up -d db
```

## 6. Настройка бэкапов

### 6.1 Создание скрипта для бэкапов
Создайте файл `backup.sh`:
```bash
#!/bin/bash

# Создание бэкапа базы данных
docker exec -t postgres pg_dump -U vetclinic_user vetclinic > backup_$(date +%Y%m%d_%H%M%S).sql

# Сжатие бэкапа
gzip backup_*.sql

# Удаление старых бэкапов (старше 7 дней)
find . -name "backup_*.sql.gz" -mtime +7 -delete
```

### 6.2 Настройка автоматических бэкапов
```bash
# Сделать скрипт исполняемым
chmod +x backup.sh

# Добавить в crontab (бэкапы каждый день в 3 утра)
(crontab -l 2>/dev/null; echo "0 3 * * * /path/to/backup.sh") | crontab -
```

## 7. Развертывание приложения

### 7.1 Клонирование репозитория
```bash
git clone your-repository-url
cd your-project
```

### 7.2 Настройка переменных окружения
Создайте файл `.env`:
```env
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://vetclinic_user:your_secure_password@db:5432/vetclinic
ALLOWED_HOSTS=your-domain.com
```

### 7.3 Сборка и запуск приложения
```bash
# Сборка Docker-образов
docker-compose build

# Запуск приложения
docker-compose up -d
```

## 8. Мониторинг и обслуживание

### 8.1 Просмотр логов
```bash
# Логи Django
docker-compose logs backend

# Логи React
docker-compose logs frontend

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 8.2 Перезапуск сервисов
```bash
# Перезапуск всего приложения
docker-compose restart

# Перезапуск конкретного сервиса
docker-compose restart backend
```

## 9. Безопасность

### 9.1 Настройка файрвола
```bash
# Установка UFW
sudo apt install -y ufw

# Настройка правил
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 9.2 Регулярные обновления
```bash
# Добавьте в crontab
0 4 * * * apt update && apt upgrade -y
```

## 10. Устранение неполадок

### 10.1 Проверка статуса сервисов
```bash
# Статус Docker-контейнеров
docker-compose ps

# Статус Nginx
sudo systemctl status nginx

# Статус базы данных
docker exec -it postgres psql -U vetclinic_user -d vetclinic
```

### 10.2 Проверка логов
```bash
# Логи приложения
docker-compose logs -f

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
```

## Полезные команды

```bash
# Перезапуск всех сервисов
docker-compose restart

# Просмотр использования ресурсов
docker stats

# Очистка неиспользуемых Docker-ресурсов
docker system prune -a

# Проверка статуса SSL-сертификата
sudo certbot certificates
```

## Рекомендации по безопасности

1. Регулярно обновляйте систему и зависимости
2. Используйте сложные пароли
3. Настройте мониторинг сервера
4. Регулярно проверяйте логи на наличие подозрительной активности
5. Настройте автоматические бэкапы
6. Используйте SSL для всех соединений
7. Ограничьте доступ к серверу по SSH только с определенных IP-адресов 