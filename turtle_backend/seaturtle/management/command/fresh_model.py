from django.core.management.base import BaseCommand
from seaturtle.models import SeaTurtle, Keyword
from datetime import datetime
from seaturtle.qa import get_story

class Command(BaseCommand):
    help = 'Runs the get_story function'

    def handle(self, *args, **options):
        print("nextday")
        get_story()
