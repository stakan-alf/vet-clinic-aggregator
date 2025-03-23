from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VetClinicViewSet, ServiceViewSet, FavoriteClinicViewSet

router = DefaultRouter()
router.register(r'clinics', VetClinicViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'favorites', FavoriteClinicViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
] 