import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login/`, {
      email,
      password,
    });
    return response.data;
  },

  async loginWithGoogle() {
    const response = await axios.get(`${API_URL}/auth/google/`);
    return response.data;
  },

  async register(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/register/`, {
      email,
      password,
    });
    return response.data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post(
        `${API_URL}/auth/logout/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  },

  async resetPassword(email: string) {
    const response = await axios.post(`${API_URL}/auth/password-reset/`, {
      email,
    });
    return response.data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await axios.get(`${API_URL}/auth/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export { authService }; 