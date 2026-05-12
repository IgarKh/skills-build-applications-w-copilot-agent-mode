from django.core.management.base import BaseCommand
from octofit_tracker import models

class Command(BaseCommand):
    help = 'Populate the database with initial data for OctoFit Tracker'

    def handle(self, *args, **options):
        # Example: create initial data for demonstration
        # You should adjust this to match your actual models
        if hasattr(models, 'UserProfile'):
            if not models.UserProfile.objects.exists():
                models.UserProfile.objects.create(user_id=1, bio='Demo user')
                self.stdout.write(self.style.SUCCESS('Created demo UserProfile'))
            else:
                self.stdout.write(self.style.WARNING('UserProfile data already exists'))
        else:
            self.stdout.write(self.style.WARNING('UserProfile model not found. Please define your models.'))
