from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_phone_number(value):
    """
    Валидация номера телефона
    """
    if not value.isdigit():
        raise ValidationError(
            _('%(value)s должен содержать только цифры'),
            params={'value': value},
        )
    if len(value) < 10 or len(value) > 15:
        raise ValidationError(
            _('%(value)s должен содержать от 10 до 15 цифр'),
            params={'value': value},
        )

def get_file_path(instance, filename):
    """
    Генерация пути для сохранения файлов
    """
    ext = filename.split('.')[-1]
    filename = f"{instance._meta.model_name}_{instance.id}.{ext}"
    return f"uploads/{instance._meta.app_label}/{filename}" 