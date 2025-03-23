import tempfile
from PIL import Image
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from core.tests.test_base import BaseAPITest
from pets.models import Pet, VetRecord

class PetAPITest(BaseAPITest):
    def setUp(self):
        """Set up test data."""
        super().setUp()
        self.pet_data = {
            'name': 'Test Pet',
            'species': 'Dog',
            'breed': 'Test Breed',
            'age': 2,
            'owner': self.user
        }
        self.pet = Pet.objects.create(**self.pet_data)

    def create_test_image(self):
        """Create a test image file."""
        image = Image.new('RGB', (100, 100), color='red')
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        tmp_file.seek(0)
        return tmp_file

    def test_list_pets(self):
        """Test getting list of pets."""
        self.authenticate()
        url = reverse('pet-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.pet_data['name'])

    def test_create_pet(self):
        """Test creating a new pet."""
        self.authenticate()
        url = reverse('pet-list')
        new_pet_data = {
            'name': 'New Pet',
            'species': 'Cat',
            'breed': 'New Breed',
            'age': 1
        }
        response = self.client.post(url, new_pet_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Pet.objects.filter(name=new_pet_data['name']).exists())

    def test_upload_pet_photo(self):
        """Test uploading pet photo."""
        self.authenticate()
        url = reverse('pet-photo-upload', args=[self.pet.id])
        with self.create_test_image() as image_file:
            photo = SimpleUploadedFile(
                name='test.jpg',
                content=image_file.read(),
                content_type='image/jpeg'
            )
            response = self.client.post(url, {'photo': photo})
            self.assertEqual(response.status_code, 200)
            self.pet.refresh_from_db()
            self.assertIsNotNone(self.pet.photo)
            self.assertIsNotNone(self.pet.thumbnail)

    def test_create_vet_record(self):
        """Test creating a veterinary record."""
        self.authenticate()
        url = reverse('pet-records', args=[self.pet.id])
        record_data = {
            'title': 'Test Record',
            'description': 'Test Description',
            'date': '2024-03-14'
        }
        response = self.client.post(url, record_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(VetRecord.objects.filter(
            pet=self.pet,
            title=record_data['title']
        ).exists()) 