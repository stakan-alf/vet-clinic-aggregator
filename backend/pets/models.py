from django.db import models
from users.models import User

class Pet(models.Model):
    PET_TYPES = [
        ('dog', 'Собака'),
        ('cat', 'Кошка'),
        ('bird', 'Птица'),
        ('other', 'Другое'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Кличка')
    pet_type = models.CharField(max_length=10, choices=PET_TYPES, verbose_name='Тип животного')
    breed = models.CharField(max_length=100, verbose_name='Порода')
    birth_date = models.DateField(verbose_name='Дата рождения')
    weight = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='Вес (кг)')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Питомец'
        verbose_name_plural = 'Питомцы'
        
    def __str__(self):
        return f"{self.name} ({self.get_pet_type_display()})"

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

class Vaccination(models.Model):
    passport = models.ForeignKey(VetPassport, on_delete=models.CASCADE, related_name='vaccinations')
    name = models.CharField(max_length=100, verbose_name='Название вакцины')
    date = models.DateField(verbose_name='Дата вакцинации')
    next_date = models.DateField(verbose_name='Следующая вакцинация')
    vet = models.ForeignKey('clinics.Vet', on_delete=models.CASCADE, verbose_name='Ветеринар')
    
    class Meta:
        verbose_name = 'Вакцинация'
        verbose_name_plural = 'Вакцинации'
        
    def __str__(self):
        return f"{self.name} - {self.pet.name}" 