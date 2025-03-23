from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Расширенная модель пользователя с дополнительными полями
    """
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name='Номер телефона'
    )
    address = models.TextField(
        blank=True,
        null=True,
        verbose_name='Адрес'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата регистрации'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )
    is_vet = models.BooleanField(default=False)
    is_clinic_admin = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.username} ({self.email})' 