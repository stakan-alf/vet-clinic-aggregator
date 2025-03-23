import csv
import logging
from typing import List, Dict, Any
from django.core.exceptions import ValidationError
from ..models import VetClinic, Service
from ..validators import (
    validate_phone,
    validate_working_hours,
    validate_services,
    validate_postal_code
)

logger = logging.getLogger(__name__)

class ClinicImportService:
    def __init__(self):
        self.required_fields = {
            'name', 'address', 'city', 'postal_code',
            'phone', 'email', 'website', 'working_hours', 'services'
        }

    def validate_row(self, row: Dict[str, Any]) -> List[str]:
        """Проверяет корректность данных в строке CSV"""
        errors = []
        
        # Проверка наличия обязательных полей
        missing_fields = self.required_fields - set(row.keys())
        if missing_fields:
            errors.append(f"Отсутствуют обязательные поля: {', '.join(missing_fields)}")
            return errors

        # Валидация данных
        try:
            validate_phone(row['phone'])
        except ValidationError as e:
            errors.append(f"Ошибка в поле phone: {str(e)}")

        try:
            validate_working_hours(row['working_hours'])
        except ValidationError as e:
            errors.append(f"Ошибка в поле working_hours: {str(e)}")

        try:
            validate_services(row['services'])
        except ValidationError as e:
            errors.append(f"Ошибка в поле services: {str(e)}")

        try:
            validate_postal_code(row['postal_code'])
        except ValidationError as e:
            errors.append(f"Ошибка в поле postal_code: {str(e)}")

        return errors

    def process_services(self, clinic: VetClinic, services_str: str) -> None:
        """Обрабатывает и создает связи с услугами"""
        services = [s.strip() for s in services_str.split(',')]
        for service_name in services:
            service, created = Service.objects.get_or_create(
                name=service_name,
                defaults={'description': f'Услуга {service_name}'}
            )
            clinic.services.add(service)

    def import_clinics(self, csv_file_path: str) -> Dict[str, Any]:
        """Импортирует клиники из CSV-файла"""
        results = {
            'success': 0,
            'errors': 0,
            'skipped': 0,
            'details': []
        }

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row_number, row in enumerate(reader, 1):
                    logger.info(f"Обработка строки {row_number}: {row.get('name', 'Unknown')}")
                    
                    # Валидация данных
                    errors = self.validate_row(row)
                    if errors:
                        results['errors'] += 1
                        results['details'].append({
                            'row': row_number,
                            'clinic': row.get('name', 'Unknown'),
                            'errors': errors
                        })
                        continue

                    try:
                        # Создание или обновление клиники
                        clinic, created = VetClinic.objects.update_or_create(
                            name=row['name'],
                            defaults={
                                'address': row['address'],
                                'city': row['city'],
                                'postal_code': row['postal_code'],
                                'phone': row['phone'],
                                'email': row['email'],
                                'website': row['website'],
                                'working_hours': row['working_hours'],
                            }
                        )

                        # Обработка услуг
                        self.process_services(clinic, row['services'])

                        results['success'] += 1
                        logger.info(f"Клиника {row['name']} успешно {'создана' if created else 'обновлена'}")

                    except Exception as e:
                        results['errors'] += 1
                        results['details'].append({
                            'row': row_number,
                            'clinic': row.get('name', 'Unknown'),
                            'errors': [str(e)]
                        })
                        logger.error(f"Ошибка при обработке клиники {row.get('name', 'Unknown')}: {str(e)}")

        except Exception as e:
            logger.error(f"Ошибка при чтении файла: {str(e)}")
            results['errors'] += 1
            results['details'].append({
                'row': 0,
                'clinic': 'File',
                'errors': [f"Ошибка чтения файла: {str(e)}"]
            })

        return results 