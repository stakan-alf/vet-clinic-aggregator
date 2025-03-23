from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer, UserUpdateSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiExample,
)
from drf_spectacular.types import OpenApiTypes

User = get_user_model()

@extend_schema_view(
    list=extend_schema(
        summary="Получить список пользователей",
        description="Возвращает список всех пользователей системы. Требует аутентификации.",
        tags=["users"],
    ),
    create=extend_schema(
        summary="Создать нового пользователя",
        description="Создает нового пользователя в системе. Доступно без аутентификации.",
        tags=["users"],
    ),
    retrieve=extend_schema(
        summary="Получить информацию о пользователе",
        description="Возвращает подробную информацию о конкретном пользователе.",
        tags=["users"],
    ),
    update=extend_schema(
        summary="Обновить информацию о пользователе",
        description="Полностью обновляет информацию о пользователе.",
        tags=["users"],
    ),
    partial_update=extend_schema(
        summary="Частично обновить информацию о пользователе",
        description="Частично обновляет информацию о пользователе.",
        tags=["users"],
    ),
    destroy=extend_schema(
        summary="Удалить пользователя",
        description="Удаляет пользователя из системы.",
        tags=["users"],
    ),
)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @extend_schema(
        summary="Получить информацию о текущем пользователе",
        description="Возвращает информацию о пользователе, который выполнил запрос.",
        tags=["users"],
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

@extend_schema(
    summary="Регистрация нового пользователя",
    description="Создает нового пользователя в системе. Доступно без аутентификации.",
    request=UserRegistrationSerializer,
    responses={201: UserSerializer},
    tags=["auth"],
)
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 