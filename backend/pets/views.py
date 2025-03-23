from rest_framework import viewsets, permissions
from .models import Pet, VetPassport
from .serializers import (
    PetSerializer, PetCreateSerializer,
    VetPassportSerializer, VetPassportCreateSerializer
)
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
)
from drf_spectacular.types import OpenApiTypes

@extend_schema_view(
    list=extend_schema(
        summary="Получить список питомцев",
        description="Возвращает список всех питомцев текущего пользователя.",
        tags=["pets"],
    ),
    create=extend_schema(
        summary="Создать нового питомца",
        description="Создает нового питомца в системе. Требует аутентификации.",
        tags=["pets"],
    ),
    retrieve=extend_schema(
        summary="Получить информацию о питомце",
        description="Возвращает подробную информацию о конкретном питомце.",
        tags=["pets"],
    ),
    update=extend_schema(
        summary="Обновить информацию о питомце",
        description="Полностью обновляет информацию о питомце.",
        tags=["pets"],
    ),
    partial_update=extend_schema(
        summary="Частично обновить информацию о питомце",
        description="Частично обновляет информацию о питомце.",
        tags=["pets"],
    ),
    destroy=extend_schema(
        summary="Удалить питомца",
        description="Удаляет питомца из системы.",
        tags=["pets"],
    ),
)
class PetViewSet(viewsets.ModelViewSet):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pet.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return PetCreateSerializer
        return PetSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@extend_schema_view(
    list=extend_schema(
        summary="Получить список ветеринарных паспортов",
        description="Возвращает список всех ветеринарных паспортов питомцев текущего пользователя.",
        tags=["passports"],
    ),
    create=extend_schema(
        summary="Создать новый ветеринарный паспорт",
        description="Создает новый ветеринарный паспорт для питомца. Требует аутентификации.",
        tags=["passports"],
    ),
    retrieve=extend_schema(
        summary="Получить информацию о ветеринарном паспорте",
        description="Возвращает подробную информацию о конкретном ветеринарном паспорте.",
        tags=["passports"],
    ),
    update=extend_schema(
        summary="Обновить информацию о ветеринарном паспорте",
        description="Полностью обновляет информацию о ветеринарном паспорте.",
        tags=["passports"],
    ),
    partial_update=extend_schema(
        summary="Частично обновить информацию о ветеринарном паспорте",
        description="Частично обновляет информацию о ветеринарном паспорте.",
        tags=["passports"],
    ),
    destroy=extend_schema(
        summary="Удалить ветеринарный паспорт",
        description="Удаляет ветеринарный паспорт из системы.",
        tags=["passports"],
    ),
)
class VetPassportViewSet(viewsets.ModelViewSet):
    serializer_class = VetPassportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VetPassport.objects.filter(pet__owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return VetPassportCreateSerializer
        return VetPassportSerializer 