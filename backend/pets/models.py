from django.db import models
from django.conf import settings

class Pet(models.Model):
    """
    Модель для хранения информации о питомцах
    """
    PET_TYPES = [
        ('dog', 'Собака'),
        ('cat', 'Кошка'),
        ('bird', 'Птица'),
        ('reptile', 'Рептилия'),
        ('other', 'Другое'),
    ]

    GENDER_CHOICES = [
        ('male', 'Мужской'),
        ('female', 'Женский'),
        ('unknown', 'Неизвестно'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pets',
        verbose_name='Владелец'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Кличка'
    )
    pet_type = models.CharField(
        max_length=20,
        choices=PET_TYPES,
        verbose_name='Тип питомца'
    )
    breed = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Порода'
    )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        default='unknown',
        verbose_name='Пол'
    )
    birth_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Дата рождения'
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Вес (кг)'
    )
    photo = models.ImageField(
        upload_to='pets/photos/',
        null=True,
        blank=True,
        verbose_name='Фото питомца'
    )
    thumbnail = models.ImageField(
        upload_to='pets/thumbnails/',
        null=True,
        blank=True,
        verbose_name='Миниатюра'
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
        verbose_name = 'Питомец'
        verbose_name_plural = 'Питомцы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.get_pet_type_display()})'

class VetPassport(models.Model):
    pet = models.OneToOneField(Pet, on_delete=models.CASCADE, related_name='passport')
    passport_number = models.CharField(max_length=50, unique=True, verbose_name='Номер паспорта')
    chip_number = models.CharField(max_length=50, blank=True, null=True, verbose_name='Номер чипа')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Ветпаспорт'
        verbose_name_plural = 'Ветпаспорта'
        
    def __str__(self):
        return f"Паспорт {self.pet.name}"

class VetRecord(models.Model):
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name='Питомец'
    )
    clinic = models.ForeignKey(
        'clinics.VetClinic',
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name='Клиника'
    )
    service = models.ForeignKey(
        'clinics.Service',
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name='Услуга'
    )
    date = models.DateTimeField(
        verbose_name='Дата записи'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Заметки'
    )
    document = models.FileField(
        upload_to='records/documents/',
        null=True,
        blank=True,
        verbose_name='Документ'
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
        verbose_name = 'Ветеринарная запись'
        verbose_name_plural = 'Ветеринарные записи'
        ordering = ['-date']

    def __str__(self):
        return f"Запись {self.pet.name} в {self.clinic.name} на {self.date}" 