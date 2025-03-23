from PIL import Image
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_image_size(image):
    """Проверка размера изображения"""
    if image.size > settings.MAX_IMAGE_SIZE:
        raise ValidationError(_('Размер файла не должен превышать 5MB'))

def validate_document_size(document):
    """Проверка размера документа"""
    if document.size > settings.MAX_DOCUMENT_SIZE:
        raise ValidationError(_('Размер файла не должен превышать 10MB'))

def validate_file_type(file, allowed_types):
    """Проверка типа файла"""
    if file.content_type not in allowed_types:
        raise ValidationError(_('Неподдерживаемый тип файла'))

def create_thumbnail(image_path, size=settings.THUMBNAIL_SIZE):
    """Создание миниатюры изображения"""
    try:
        with Image.open(image_path) as img:
            img.thumbnail(size, Image.Resampling.LANCZOS)
            # Создаем путь для миниатюры
            thumb_path = image_path.replace('.', '_thumb.')
            img.save(thumb_path, quality=85)
            return thumb_path
    except Exception as e:
        raise ValidationError(_(f'Ошибка при создании миниатюры: {str(e)}'))

def get_file_path(instance, filename, folder):
    """Генерация пути для сохранения файла"""
    ext = filename.split('.')[-1]
    filename = f"{instance.id}.{ext}"
    return f"{folder}/{filename}" 