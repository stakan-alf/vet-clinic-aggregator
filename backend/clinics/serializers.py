from rest_framework import serializers
from .models import VetClinic, Service, ClinicService, FavoriteClinic

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ClinicServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = ClinicService
        fields = ['id', 'clinic', 'service', 'service_name', 'price', 'duration', 'is_available']

class VetClinicSerializer(serializers.ModelSerializer):
    services = ClinicServiceSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = VetClinic
        fields = '__all__'

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FavoriteClinic.objects.filter(
                user=request.user,
                clinic=obj
            ).exists()
        return False

class VetClinicCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetClinic
        fields = ('name', 'description', 'address', 'phone', 'email',
                 'website', 'working_hours')

class FavoriteClinicSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)

    class Meta:
        model = FavoriteClinic
        fields = ['id', 'clinic', 'clinic_name', 'created_at'] 