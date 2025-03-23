from django.urls import reverse
from core.tests.test_base import BaseAPITest
from clinics.models import Clinic, Service

class ClinicAPITest(BaseAPITest):
    def setUp(self):
        """Set up test data."""
        super().setUp()
        self.clinic_data = {
            'name': 'Test Clinic',
            'address': 'Test Address',
            'phone': '+1234567890',
            'description': 'Test Description',
            'working_hours': '9:00-18:00'
        }
        self.clinic = Clinic.objects.create(**self.clinic_data)
        self.service = Service.objects.create(
            clinic=self.clinic,
            name='Test Service',
            price=100.00,
            duration=30
        )

    def test_list_clinics(self):
        """Test getting list of clinics."""
        url = reverse('clinic-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.clinic_data['name'])

    def test_clinic_detail(self):
        """Test getting clinic details."""
        url = reverse('clinic-detail', args=[self.clinic.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.clinic_data['name'])

    def test_create_clinic(self):
        """Test creating a new clinic."""
        self.authenticate()
        url = reverse('clinic-list')
        new_clinic_data = {
            'name': 'New Clinic',
            'address': 'New Address',
            'phone': '+0987654321',
            'description': 'New Description',
            'working_hours': '10:00-19:00'
        }
        response = self.client.post(url, new_clinic_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Clinic.objects.filter(name=new_clinic_data['name']).exists())

    def test_clinic_services(self):
        """Test getting clinic services."""
        url = reverse('clinic-services', args=[self.clinic.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.service.name)

    def test_clinic_search(self):
        """Test searching clinics."""
        url = reverse('clinic-list')
        response = self.client.get(url, {'search': 'Test'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.clinic_data['name']) 