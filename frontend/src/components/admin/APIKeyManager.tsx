import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Alert } from '../ui/Alert';

interface APIKey {
  id: number;
  name: string;
  service: number;
  api_key: string;
  decrypted_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  last_used: string | null;
}

const serviceOptions = [
  { value: 1, label: 'Google Maps' },
  { value: 2, label: 'Яндекс Карты' },
  { value: 3, label: 'Telegram Bot' },
  { value: 4, label: 'SMS Gateway' },
  { value: 5, label: 'Email Service' },
];

export const APIKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    service: 1,
    api_key: '',
    description: '',
  });

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api-keys/');
      setApiKeys(response.data);
    } catch (err) {
      setError('Ошибка при загрузке API ключей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingKey) {
        await api.put(`/api-keys/${editingKey.id}/`, formData);
      } else {
        await api.post('/api-keys/', formData);
      }
      setShowModal(false);
      fetchAPIKeys();
      resetForm();
    } catch (err) {
      setError('Ошибка при сохранении API ключа');
      console.error(err);
    }
  };

  const handleEdit = (key: APIKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      service: key.service,
      api_key: key.decrypted_key,
      description: key.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот API ключ?')) {
      try {
        await api.delete(`/api-keys/${id}/`);
        fetchAPIKeys();
      } catch (err) {
        setError('Ошибка при удалении API ключа');
        console.error(err);
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await api.post(`/api-keys/${id}/toggle_active/`);
      fetchAPIKeys();
    } catch (err) {
      setError('Ошибка при изменении статуса API ключа');
      console.error(err);
    }
  };

  const handleTest = async (id: number) => {
    try {
      await api.post(`/api-keys/${id}/test/`);
      fetchAPIKeys();
    } catch (err) {
      setError('Ошибка при тестировании API ключа');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      service: 1,
      api_key: '',
      description: '',
    });
    setEditingKey(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление API ключами</h2>
        <Button onClick={() => setShowModal(true)}>
          Добавить API ключ
        </Button>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сервис
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Последнее использование
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{key.name}</div>
                  <div className="text-sm text-gray-500">{key.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {serviceOptions.find(opt => opt.value === key.service)?.label}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {key.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {key.last_used ? new Date(key.last_used).toLocaleString() : 'Никогда'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(key.id)}
                    className="mr-2"
                  >
                    Тест
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(key.id)}
                    className="mr-2"
                  >
                    {key.is_active ? 'Деактивировать' : 'Активировать'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(key)}
                    className="mr-2"
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(key.id)}
                    className="text-red-600"
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingKey ? 'Редактировать API ключ' : 'Добавить API ключ'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Сервис
            </label>
            <Select
              value={formData.service}
              onChange={(value) => setFormData({ ...formData, service: value })}
              options={serviceOptions}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              API Ключ
            </label>
            <Input
              type="password"
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Описание
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Отмена
            </Button>
            <Button type="submit">
              {editingKey ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}; 