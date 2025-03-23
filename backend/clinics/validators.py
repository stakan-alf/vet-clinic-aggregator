from django.core.validators import URLValidator, EmailValidator
from django.core.exceptions import ValidationError
import re

def validate_phone(value):
    """Проверяет корректность номера телефона"""
    # Удаляем все нецифровые символы
    phone = re.sub(r'\D', '', value)
    if len(phone) < 10 or len(phone) > 15:
        raise ValidationError('Номер телефона должен содержать от 10 до 15 цифр')

def validate_working_hours(value):
    """Проверяет корректность формата часов работы"""
    pattern = r'^([A-Za-z]{2}-[A-Za-z]{2}\s\d{1,2}-\d{1,2}(,\s[A-Za-z]{2}-[A-Za-z]{2}\s\d{1,2}-\d{1,2})*)$'
    if not re.match(pattern, value):
        raise ValidationError('Неверный формат часов работы. Используйте формат: Mo-Fr 9-18, Sa 10-14')

def validate_services(value):
    """Проверяет корректность списка услуг"""
    if not value:
        raise ValidationError('Список услуг не может быть пустым')
    services = [s.strip() for s in value.split(',')]
    if not all(services):
        raise ValidationError('Названия услуг не могут быть пустыми')

def validate_postal_code(value):
    """Проверяет корректность почтового индекса"""
    if not re.match(r'^\d{5,10}$', value):
        raise ValidationError('Почтовый индекс должен содержать от 5 до 10 цифр') 