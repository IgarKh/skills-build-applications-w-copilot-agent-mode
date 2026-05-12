from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from octofit_tracker.models import Team, Activity, Workout
from datetime import date

class Command(BaseCommand):
    help = 'Populate the database with initial test data for OctoFit Tracker'

    def handle(self, *args, **options):
        # Create test user if not exists
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'testuser@example.com',
                'is_active': True
            }
        )
        if created:
            user.set_password('testpassword')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created test user'))
        else:
            self.stdout.write(self.style.WARNING('Test user already exists'))

        # Create test team
        team, team_created = Team.objects.get_or_create(name='Test Team')
        if team_created:
            team.members.add(user)
            self.stdout.write(self.style.SUCCESS('Created test team and added user'))
        else:
            self.stdout.write(self.style.WARNING('Test team already exists'))
            if user not in team.members.all():
                team.members.add(user)
                self.stdout.write(self.style.SUCCESS('Added user to test team'))

        # Create test activity
        activity, activity_created = Activity.objects.get_or_create(
            user=user,
            team=team,
            type='Running',
            date=date.today(),
            defaults={
                'duration': 30,
                'distance': 5.0,
                'calories': 300
            }
        )
        if activity_created:
            self.stdout.write(self.style.SUCCESS('Created test activity'))
        else:
            self.stdout.write(self.style.WARNING('Test activity already exists'))

        # Create test workout
        workout, workout_created = Workout.objects.get_or_create(
            user=user,
            name='Morning Cardio',
            defaults={
                'description': '30 minutes of running',
                'suggested_by': user
            }
        )
        if workout_created:
            self.stdout.write(self.style.SUCCESS('Created test workout'))
        else:
            self.stdout.write(self.style.WARNING('Test workout already exists'))
