from django.db import models
from users.models import User

class Clinic(models.Model):
    name = models.CharField(max_length=200, verbose_name='Название клиники')
    address = models.TextField(verbose_name='Адрес')
    phone = models.CharField(max_length=15, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    working_hours = models.TextField(verbose_name='Часы работы')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_clinics')
    
    class Meta:
        verbose_name = 'Клиника'
        verbose_name_plural = 'Клиники'
        
    def __str__(self):
        return self.name

class Vet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vet_profile')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='vets')
    specialization = models.CharField(max_length=100, verbose_name='Специализация')
    experience = models.IntegerField(verbose_name='Опыт работы (лет)')
    
    class Meta:
        verbose_name = 'Ветеринар'
        verbose_name_plural = 'Ветеринары'
        
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialization}" 