from django.urls import reverse
from core.tests.test_base import BaseAPITest
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTest(BaseAPITest):
    def test_user_registration(self):
        """Test user registration endpoint."""
        url = reverse('user-register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email=data['email']).exists())

    def test_user_login(self):
        """Test user login endpoint."""
        url = reverse('token_obtain_pair')
        data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_refresh(self):
        """Test token refresh endpoint."""
        tokens = self.get_tokens_for_user(self.user)
        url = reverse('token_refresh')
        data = {'refresh': tokens['refresh']}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)

    def test_invalid_login(self):
        """Test login with invalid credentials."""
        url = reverse('token_obtain_pair')
        data = {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401) 