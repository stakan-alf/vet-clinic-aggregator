from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import UserViewSet
from clinics.views import VetClinicViewSet, ServiceViewSet, FavoriteClinicViewSet
from pets.views import PetViewSet, VetPassportViewSet
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'clinics', VetClinicViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'favorites', FavoriteClinicViewSet, basename='favorite')
router.register(r'pets', PetViewSet, basename='pet')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/clinics/', include('clinics.urls')),
    path('api/pets/', include('pets.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/pets/<int:pet_pk>/passport/', VetPassportViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update'}), name='pet-passport'),
    
    # Документация API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 