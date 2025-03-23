import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PetForm from '../PetForm';

describe('PetForm', () => {
  const mockOnSubmit = jest.fn();
  const mockPet = {
    id: 1,
    name: 'Test Pet',
    type: 'dog',
    breed: 'Labrador',
    age: 3,
    weight: 15
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty form correctly', () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Добавить питомца')).toBeInTheDocument();
    expect(screen.getByLabelText('Кличка')).toBeInTheDocument();
    expect(screen.getByLabelText('Тип')).toBeInTheDocument();
    expect(screen.getByLabelText('Порода')).toBeInTheDocument();
    expect(screen.getByLabelText('Возраст')).toBeInTheDocument();
    expect(screen.getByLabelText('Вес (кг)')).toBeInTheDocument();
    expect(screen.getByText('Сохранить')).toBeInTheDocument();
  });

  it('renders form with existing pet data', () => {
    render(<PetForm onSubmit={mockOnSubmit} pet={mockPet} />);

    expect(screen.getByText('Редактировать питомца')).toBeInTheDocument();
    expect(screen.getByLabelText('Кличка')).toHaveValue(mockPet.name);
    expect(screen.getByLabelText('Тип')).toHaveValue(mockPet.type);
    expect(screen.getByLabelText('Порода')).toHaveValue(mockPet.breed);
    expect(screen.getByLabelText('Возраст')).toHaveValue(mockPet.age.toString());
    expect(screen.getByLabelText('Вес (кг)')).toHaveValue(mockPet.weight.toString());
  });

  it('handles successful form submission', async () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Кличка');
    const typeInput = screen.getByLabelText('Тип');
    const breedInput = screen.getByLabelText('Порода');
    const ageInput = screen.getByLabelText('Возраст');
    const weightInput = screen.getByLabelText('Вес (кг)');
    const submitButton = screen.getByText('Сохранить');

    fireEvent.change(nameInput, { target: { value: 'New Pet' } });
    fireEvent.change(typeInput, { target: { value: 'cat' } });
    fireEvent.change(breedInput, { target: { value: 'Persian' } });
    fireEvent.change(ageInput, { target: { value: '2' } });
    fireEvent.change(weightInput, { target: { value: '5' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Pet',
        type: 'cat',
        breed: 'Persian',
        age: 2,
        weight: 5
      });
    });
  });

  it('validates required fields', async () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('Сохранить');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Кличка обязательна')).toBeInTheDocument();
      expect(screen.getByText('Тип обязателен')).toBeInTheDocument();
      expect(screen.getByText('Порода обязательна')).toBeInTheDocument();
      expect(screen.getByText('Возраст обязателен')).toBeInTheDocument();
      expect(screen.getByText('Вес обязателен')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('validates age range', async () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Кличка');
    const typeInput = screen.getByLabelText('Тип');
    const breedInput = screen.getByLabelText('Порода');
    const ageInput = screen.getByLabelText('Возраст');
    const weightInput = screen.getByLabelText('Вес (кг)');
    const submitButton = screen.getByText('Сохранить');

    fireEvent.change(nameInput, { target: { value: 'Test Pet' } });
    fireEvent.change(typeInput, { target: { value: 'dog' } });
    fireEvent.change(breedInput, { target: { value: 'Labrador' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.change(weightInput, { target: { value: '15' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Возраст должен быть от 0 до 25 лет')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('validates weight range', async () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Кличка');
    const typeInput = screen.getByLabelText('Тип');
    const breedInput = screen.getByLabelText('Порода');
    const ageInput = screen.getByLabelText('Возраст');
    const weightInput = screen.getByLabelText('Вес (кг)');
    const submitButton = screen.getByText('Сохранить');

    fireEvent.change(nameInput, { target: { value: 'Test Pet' } });
    fireEvent.change(typeInput, { target: { value: 'dog' } });
    fireEvent.change(breedInput, { target: { value: 'Labrador' } });
    fireEvent.change(ageInput, { target: { value: '3' } });
    fireEvent.change(weightInput, { target: { value: '100' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Вес должен быть от 0 до 50 кг')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('validates name length', async () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Кличка');
    const typeInput = screen.getByLabelText('Тип');
    const breedInput = screen.getByLabelText('Порода');
    const ageInput = screen.getByLabelText('Возраст');
    const weightInput = screen.getByLabelText('Вес (кг)');
    const submitButton = screen.getByText('Сохранить');

    fireEvent.change(nameInput, { target: { value: 'a'.repeat(51) } });
    fireEvent.change(typeInput, { target: { value: 'dog' } });
    fireEvent.change(breedInput, { target: { value: 'Labrador' } });
    fireEvent.change(ageInput, { target: { value: '3' } });
    fireEvent.change(weightInput, { target: { value: '15' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Кличка не должна превышать 50 символов')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('validates breed length', async () => {
    render(<PetForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Кличка');
    const typeInput = screen.getByLabelText('Тип');
    const breedInput = screen.getByLabelText('Порода');
    const ageInput = screen.getByLabelText('Возраст');
    const weightInput = screen.getByLabelText('Вес (кг)');
    const submitButton = screen.getByText('Сохранить');

    fireEvent.change(nameInput, { target: { value: 'Test Pet' } });
    fireEvent.change(typeInput, { target: { value: 'dog' } });
    fireEvent.change(breedInput, { target: { value: 'a'.repeat(51) } });
    fireEvent.change(ageInput, { target: { value: '3' } });
    fireEvent.change(weightInput, { target: { value: '15' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Порода не должна превышать 50 символов')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('handles form cancellation', () => {
    const mockOnCancel = jest.fn();
    render(<PetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Отмена');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 