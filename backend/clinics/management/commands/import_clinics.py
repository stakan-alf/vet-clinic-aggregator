from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from clinics.services.import_service import ClinicImportService
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Импортирует данные о ветеринарных клиниках из CSV-файла'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Путь к CSV-файлу с данными о клиниках')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        self.stdout.write(f'Начало импорта из файла: {csv_file}')

        try:
            service = ClinicImportService()
            results = service.import_clinics(csv_file)

            # Вывод результатов
            self.stdout.write(self.style.SUCCESS(
                f'Импорт завершен. Успешно: {results["success"]}, '
                f'Ошибок: {results["errors"]}, '
                f'Пропущено: {results["skipped"]}'
            ))

            if results['details']:
                self.stdout.write('\nДетали ошибок:')
                for detail in results['details']:
                    self.stdout.write(self.style.ERROR(
                        f'Строка {detail["row"]}, '
                        f'Клиника: {detail["clinic"]}'
                    ))
                    for error in detail['errors']:
                        self.stdout.write(self.style.ERROR(f'  - {error}'))

        except Exception as e:
            logger.error(f'Ошибка при импорте: {str(e)}')
            raise CommandError(f'Ошибка при импорте: {str(e)}') 