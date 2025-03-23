from django.urls import path
from . import views, views_media

urlpatterns = [
    # URL patterns будут добавлены позже
    
    # Media endpoints
    path('pets/<int:pet_id>/photos/', views_media.upload_pet_photo, name='upload_pet_photo'),
    path('pets/<int:pet_id>/photos/delete/', views_media.delete_pet_photo, name='delete_pet_photo'),
    path('pets/<int:pet_id>/records/<int:record_id>/documents/', views_media.upload_record_document, name='upload_record_document'),
] 