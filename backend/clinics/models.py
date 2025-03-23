from django.db import models
from django.conf import settings
from decimal import Decimal
import math

class VetClinic(models.Model):
    """
    Модель для хранения информации о ветеринарных клиниках
    """
    name = models.CharField(
        max_length=200,
        verbose_name='Название клиники'
    )
    description = models.TextField(
        verbose_name='Описание'
    )
    address = models.TextField(
        verbose_name='Адрес'
    )
    phone = models.CharField(
        max_length=20,
        verbose_name='Телефон'
    )
    email = models.EmailField(
        verbose_name='Email'
    )
    website = models.URLField(
        blank=True,
        null=True,
        verbose_name='Веб-сайт'
    )
    working_hours = models.TextField(
        verbose_name='Часы работы'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Активна'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Ветеринарная клиника'
        verbose_name_plural = 'Ветеринарные клиники'
        ordering = ['name']

    def __str__(self):
        return self.name

    def calculate_distance(self, lat, lon):
        """
        Рассчитывает расстояние до клиники по формуле гаверсинусов
        """
        R = 6371  # Радиус Земли в километрах

        lat1, lon1 = float(self.latitude), float(self.longitude)
        lat2, lon2 = float(lat), float(lon)

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (math.sin(dlat/2) * math.sin(dlat/2) +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon/2) * math.sin(dlon/2))

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance = R * c

        return round(distance, 2)

    @classmethod
    def find_nearest(cls, lat, lon, limit=10):
        """
        Находит ближайшие клиники к указанным координатам
        """
        clinics = cls.objects.filter(is_active=True)
        distances = [(clinic, clinic.calculate_distance(lat, lon)) 
                    for clinic in clinics]
        return sorted(distances, key=lambda x: x[1])[:limit]

class Service(models.Model):
    """
    Модель для хранения информации о ветеринарных услугах
    """
    name = models.CharField(
        max_length=100,
        verbose_name='Название услуги'
    )
    description = models.TextField(
        verbose_name='Описание'
    )
    category = models.CharField(
        max_length=50,
        verbose_name='Категория'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['name']

    def __str__(self):
        return self.name

class ClinicService(models.Model):
    """
    Связующая модель между клиниками и услугами с дополнительной информацией
    """
    clinic = models.ForeignKey(
        VetClinic,
        on_delete=models.CASCADE,
        related_name='services',
        verbose_name='Клиника'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        verbose_name='Услуга'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена'
    )
    duration = models.IntegerField(
        verbose_name='Длительность (минуты)'
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name='Доступна'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Услуга клиники'
        verbose_name_plural = 'Услуги клиник'
        unique_together = ['clinic', 'service']
        ordering = ['clinic', 'service']

    def __str__(self):
        return f'{self.clinic.name} - {self.service.name}'

class FavoriteClinic(models.Model):
    """
    Модель для хранения избранных клиник пользователей
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorite_clinics',
        verbose_name='Пользователь'
    )
    clinic = models.ForeignKey(
        VetClinic,
        on_delete=models.CASCADE,
        related_name='favorited_by',
        verbose_name='Клиника'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата добавления'
    )

    class Meta:
        verbose_name = 'Избранная клиника'
        verbose_name_plural = 'Избранные клиники'
        unique_together = ['user', 'clinic']
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.clinic.name}' 