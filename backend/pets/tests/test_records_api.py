import tempfile
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from core.tests.test_base import BaseAPITest
from pets.models import Pet, VetRecord

class VetRecordAPITest(BaseAPITest):
    def setUp(self):
        """Set up test data."""
        super().setUp()
        self.pet = Pet.objects.create(
            name='Test Pet',
            species='Dog',
            breed='Test Breed',
            age=2,
            owner=self.user
        )
        self.record_data = {
            'pet': self.pet,
            'title': 'Test Record',
            'description': 'Test Description',
            'date': '2024-03-14'
        }
        self.record = VetRecord.objects.create(**self.record_data)

    def test_list_records(self):
        """Test getting list of veterinary records."""
        self.authenticate()
        url = reverse('pet-records', args=[self.pet.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.record_data['title'])

    def test_create_record(self):
        """Test creating a new veterinary record."""
        self.authenticate()
        url = reverse('pet-records', args=[self.pet.id])
        new_record_data = {
            'title': 'New Record',
            'description': 'New Description',
            'date': '2024-03-15'
        }
        response = self.client.post(url, new_record_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(VetRecord.objects.filter(
            pet=self.pet,
            title=new_record_data['title']
        ).exists())

    def test_update_record(self):
        """Test updating a veterinary record."""
        self.authenticate()
        url = reverse('record-detail', args=[self.pet.id, self.record.id])
        updated_data = {
            'title': 'Updated Record',
            'description': 'Updated Description',
            'date': '2024-03-16'
        }
        response = self.client.put(url, updated_data)
        self.assertEqual(response.status_code, 200)
        self.record.refresh_from_db()
        self.assertEqual(self.record.title, updated_data['title'])

    def test_upload_document(self):
        """Test uploading document to veterinary record."""
        self.authenticate()
        url = reverse('record-document-upload', args=[self.pet.id, self.record.id])
        document = SimpleUploadedFile(
            name='test.pdf',
            content=b'Test document content',
            content_type='application/pdf'
        )
        response = self.client.post(url, {'document': document})
        self.assertEqual(response.status_code, 200)
        self.record.refresh_from_db()
        self.assertTrue(self.record.documents.exists())

    def test_delete_record(self):
        """Test deleting a veterinary record."""
        self.authenticate()
        url = reverse('record-detail', args=[self.pet.id, self.record.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(VetRecord.objects.filter(id=self.record.id).exists()) 