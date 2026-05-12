from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from octofit_tracker.models import Team, Activity, Workout
from datetime import date

class Command(BaseCommand):
    help = 'Populate the database with initial test data for OctoFit Tracker'

    def handle(self, *args, **options):
        # Clear existing test data
        self.stdout.write('Deleting old test data...')
        Workout.objects.filter(name='Morning Cardio').delete()
        Activity.objects.filter(type='Running').delete()
        Team.objects.filter(name='Test Team').delete()
        User.objects.filter(username='testuser').delete()

        # Create test user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            is_active=True
        )
        self.stdout.write(self.style.SUCCESS('Created test user'))

        # Create test team
        team = Team.objects.create(name='Test Team')
        team.members.add(user)
        self.stdout.write(self.style.SUCCESS('Created test team and added user'))

        # Create test activity
        activity = Activity.objects.create(
            user=user,
            team=team,
            type='Running',
            duration=30,
            distance=5.0,
            calories=300,
            date=date.today()
        )
        self.stdout.write(self.style.SUCCESS('Created test activity'))

        # Create test workout
        workout = Workout.objects.create(
            user=user,
            name='Morning Cardio',
            description='30 minutes of running',
            suggested_by=user
        )
        self.stdout.write(self.style.SUCCESS('Created test workout'))
