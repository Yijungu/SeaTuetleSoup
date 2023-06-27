from django.core.management.base import BaseCommand, CommandError
import csv
from api.models import SeaTurtle, Keyword
from django.db import transaction

class Command(BaseCommand):
    help = 'Inserts data from csv files to the database'

    def add_arguments(self, parser):
        parser.add_argument('seaturtle_data_path', type=str, help='Path to the csv file for SeaTurtle data')
        parser.add_argument('keyword_data_path', type=str, help='Path to the csv file for Keyword data')
        parser.add_argument('start_date', type=int, help='Start date for deletion')
        parser.add_argument('end_date', type=int, help='End date for deletion')

    @transaction.atomic
    def handle(self, *args, **options):
        start_date = options['start_date']
        end_date = options['end_date']

        SeaTurtle.objects.filter(date__range=(start_date, end_date)).delete()

        with open(options['seaturtle_data_path'], 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row
            for row in reader:
                SeaTurtle.objects.create(date=row[0], story=row[1], problem=row[2])
        
        with open(options['keyword_data_path'], 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row
            for row in reader:
                seaturtle = SeaTurtle.objects.get(date=row[0])
                Keyword.objects.create(date=seaturtle, word=row[1])
        
        self.stdout.write(self.style.SUCCESS('Data inserted successfully'))
