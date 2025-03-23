from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import VetClinic, Service, ClinicService, FavoriteClinic
from .serializers import (
    VetClinicSerializer, VetClinicCreateSerializer, ServiceSerializer,
    ClinicServiceSerializer, FavoriteClinicSerializer
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
        summary="Получить список ветеринарных клиник",
        description="Возвращает список всех ветеринарных клиник с возможностью фильтрации и поиска.",
        parameters=[
            OpenApiParameter(
                name="service",
                type=OpenApiTypes.INT,
                description="Фильтр по ID услуги"
            ),
            OpenApiParameter(
                name="is_open",
                type=OpenApiTypes.BOOL,
                description="Фильтр по статусу работы клиники"
            ),
            OpenApiParameter(
                name="search",
                type=OpenApiTypes.STR,
                description="Поиск по названию, адресу или описанию"
            ),
            OpenApiParameter(
                name="ordering",
                type=OpenApiTypes.STR,
                description="Сортировка по полям (name, rating)"
            ),
        ],
        tags=["clinics"],
    ),
    create=extend_schema(
        summary="Создать новую ветеринарную клинику",
        description="Создает новую ветеринарную клинику в системе. Требует аутентификации.",
        tags=["clinics"],
    ),
    retrieve=extend_schema(
        summary="Получить информацию о клинике",
        description="Возвращает подробную информацию о конкретной ветеринарной клинике.",
        tags=["clinics"],
    ),
    update=extend_schema(
        summary="Обновить информацию о клинике",
        description="Полностью обновляет информацию о ветеринарной клинике.",
        tags=["clinics"],
    ),
    partial_update=extend_schema(
        summary="Частично обновить информацию о клинике",
        description="Частично обновляет информацию о ветеринарной клинике.",
        tags=["clinics"],
    ),
    destroy=extend_schema(
        summary="Удалить клинику",
        description="Удаляет ветеринарную клинику из системы.",
        tags=["clinics"],
    ),
)
class VetClinicViewSet(viewsets.ModelViewSet):
    queryset = VetClinic.objects.all()
    serializer_class = VetClinicSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'description']
    ordering_fields = ['name', 'rating']

    def get_serializer_class(self):
        if self.action == 'create':
            return VetClinicCreateSerializer
        return VetClinicSerializer

    def get_queryset(self):
        queryset = VetClinic.objects.all()
        service = self.request.query_params.get('service', None)
        is_open = self.request.query_params.get('is_open', None)

        if service:
            queryset = queryset.filter(services__service_id=service)

        if is_open is not None:
            queryset = queryset.filter(is_active=is_open.lower() == 'true')

        return queryset

    @extend_schema(
        summary="Добавить клинику в избранное",
        description="Добавляет ветеринарную клинику в список избранных клиник пользователя.",
        tags=["clinics"],
    )
    @action(detail=True, methods=['post'])
    def add_to_favorites(self, request, pk=None):
        clinic = self.get_object()
        favorite, created = FavoriteClinic.objects.get_or_create(
            user=request.user,
            clinic=clinic
        )
        return Response({'status': 'clinic added to favorites'})

    @extend_schema(
        summary="Удалить клинику из избранного",
        description="Удаляет ветеринарную клинику из списка избранных клиник пользователя.",
        tags=["clinics"],
    )
    @action(detail=True, methods=['post'])
    def remove_from_favorites(self, request, pk=None):
        clinic = self.get_object()
        FavoriteClinic.objects.filter(
            user=request.user,
            clinic=clinic
        ).delete()
        return Response({'status': 'clinic removed from favorites'})

@extend_schema_view(
    list=extend_schema(
        summary="Получить список услуг",
        description="Возвращает список всех доступных ветеринарных услуг.",
        tags=["services"],
    ),
    create=extend_schema(
        summary="Создать новую услугу",
        description="Создает новую ветеринарную услугу в системе. Требует аутентификации.",
        tags=["services"],
    ),
    retrieve=extend_schema(
        summary="Получить информацию об услуге",
        description="Возвращает подробную информацию о конкретной ветеринарной услуге.",
        tags=["services"],
    ),
    update=extend_schema(
        summary="Обновить информацию об услуге",
        description="Полностью обновляет информацию о ветеринарной услуге.",
        tags=["services"],
    ),
    partial_update=extend_schema(
        summary="Частично обновить информацию об услуге",
        description="Частично обновляет информацию о ветеринарной услуге.",
        tags=["services"],
    ),
    destroy=extend_schema(
        summary="Удалить услугу",
        description="Удаляет ветеринарную услугу из системы.",
        tags=["services"],
    ),
)
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@extend_schema_view(
    list=extend_schema(
        summary="Получить список избранных клиник",
        description="Возвращает список избранных ветеринарных клиник текущего пользователя.",
        tags=["favorites"],
    ),
    create=extend_schema(
        summary="Добавить клинику в избранное",
        description="Добавляет ветеринарную клинику в список избранных клиник пользователя.",
        tags=["favorites"],
    ),
    retrieve=extend_schema(
        summary="Получить информацию об избранной клинике",
        description="Возвращает подробную информацию об избранной ветеринарной клинике.",
        tags=["favorites"],
    ),
    destroy=extend_schema(
        summary="Удалить клинику из избранного",
        description="Удаляет ветеринарную клинику из списка избранных клиник пользователя.",
        tags=["favorites"],
    ),
)
class FavoriteClinicViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteClinicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteClinic.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 