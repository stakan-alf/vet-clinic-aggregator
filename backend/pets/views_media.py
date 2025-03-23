from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.conf import settings
from .models import Pet, VetRecord
from .serializers import PetPhotoSerializer, DocumentSerializer
from core.utils.image import (
    validate_image_size,
    validate_document_size,
    validate_file_type,
    create_thumbnail,
    get_file_path
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_pet_photo(request, pet_id):
    """Загрузка фото питомца"""
    try:
        pet = Pet.objects.get(id=pet_id, owner=request.user)
        photo = request.FILES.get('photo')
        
        if not photo:
            return Response(
                {'error': 'Фото не предоставлено'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Валидация
        validate_image_size(photo)
        validate_file_type(photo, settings.ALLOWED_IMAGE_TYPES)

        # Сохранение фото
        photo_path = get_file_path(pet, photo.name, 'pets/photos')
        pet.photo.save(photo_path, photo)

        # Создание миниатюры
        thumbnail_path = create_thumbnail(pet.photo.path)
        pet.thumbnail = thumbnail_path
        pet.save()

        serializer = PetPhotoSerializer(pet)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Pet.DoesNotExist:
        return Response(
            {'error': 'Питомец не найден'},
            status=status.HTTP_404_NOT_FOUND
        )
    except ValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_record_document(request, pet_id, record_id):
    """Загрузка документа для записи"""
    try:
        record = VetRecord.objects.get(id=record_id, pet_id=pet_id, pet__owner=request.user)
        document = request.FILES.get('document')
        
        if not document:
            return Response(
                {'error': 'Документ не предоставлен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Валидация
        validate_document_size(document)
        validate_file_type(document, settings.ALLOWED_DOCUMENT_TYPES)

        # Сохранение документа
        document_path = get_file_path(record, document.name, 'records/documents')
        record.document.save(document_path, document)

        serializer = DocumentSerializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except VetRecord.DoesNotExist:
        return Response(
            {'error': 'Запись не найдена'},
            status=status.HTTP_404_NOT_FOUND
        )
    except ValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pet_photo(request, pet_id):
    """Удаление фото питомца"""
    try:
        pet = Pet.objects.get(id=pet_id, owner=request.user)
        
        if pet.photo:
            pet.photo.delete()
            if pet.thumbnail:
                pet.thumbnail.delete()
            pet.save()
            
        return Response(status=status.HTTP_204_NO_CONTENT)

    except Pet.DoesNotExist:
        return Response(
            {'error': 'Питомец не найден'},
            status=status.HTTP_404_NOT_FOUND
        ) 