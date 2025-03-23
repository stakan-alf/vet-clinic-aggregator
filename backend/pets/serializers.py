from rest_framework import serializers
from .models import Pet, VetPassport, VetRecord

class VetPassportSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetPassport
        fields = ('id', 'passport_number', 'chip_number')
        read_only_fields = ('id',)

class PetSerializer(serializers.ModelSerializer):
    passport = VetPassportSerializer(read_only=True)
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)

    class Meta:
        model = Pet
        fields = ('id', 'name', 'pet_type', 'breed', 'gender', 'birth_date',
                 'weight', 'photo', 'owner', 'owner_name', 'passport')
        read_only_fields = ('id', 'owner_name')

class PetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ('name', 'pet_type', 'breed', 'gender', 'birth_date',
                 'weight', 'photo')

class VetPassportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetPassport
        fields = ('passport_number', 'chip_number')

class PetPhotoSerializer(serializers.ModelSerializer):
    """Сериализатор для фото питомца"""
    photo_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = ['id', 'photo_url', 'thumbnail_url']

    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return self.context['request'].build_absolute_uri(obj.thumbnail.url)
        return None

class DocumentSerializer(serializers.ModelSerializer):
    """Сериализатор для документов"""
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = VetRecord
        fields = ['id', 'document_url']

    def get_document_url(self, obj):
        if obj.document:
            return self.context['request'].build_absolute_uri(obj.document.url)
        return None 