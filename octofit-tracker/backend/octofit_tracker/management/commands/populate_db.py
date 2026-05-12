from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from octofit_tracker.models import Team, Activity, Leaderboard, Workout
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Populate the database with initial test data for OctoFit Tracker'

    def handle(self, *args, **options):
        # Clear existing test data
        self.stdout.write('Deleting old test data...')
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.filter(username__in=['thundergit', 'octocat', 'monatheoctocat']).delete()

        # Create test users
        user1 = User.objects.create_user(
            username='thundergit',
            email='thundergit@example.com',
            password='testpassword123',
            first_name='Thunder',
            last_name='Git'
        )
        user2 = User.objects.create_user(
            username='octocat',
            email='octocat@example.com',
            password='testpassword123',
            first_name='Octo',
            last_name='Cat'
        )
        user3 = User.objects.create_user(
            username='monatheoctocat',
            email='monatheoctocat@example.com',
            password='testpassword123',
            first_name='Mona',
            last_name='Octocat'
        )
        self.stdout.write(self.style.SUCCESS('Created test users'))

        # Create test teams
        team1 = Team.objects.create(name='Code Runners')
        team1.members.add(user1, user2)
        team2 = Team.objects.create(name='Octo Fitness')
        team2.members.add(user2, user3)
        self.stdout.write(self.style.SUCCESS('Created test teams'))

        # Create test activities
        today = date.today()
        Activity.objects.create(
            user=user1, team=team1, type='Running',
            duration=30, distance=5.0, calories=300, date=today
        )
        Activity.objects.create(
            user=user2, team=team1, type='Cycling',
            duration=45, distance=15.0, calories=400, date=today - timedelta(days=1)
        )
        Activity.objects.create(
            user=user3, team=team2, type='Swimming',
            duration=60, distance=2.0, calories=500, date=today - timedelta(days=2)
        )
        Activity.objects.create(
            user=user1, team=team1, type='Weight Training',
            duration=40, distance=0, calories=350, date=today - timedelta(days=1)
        )
        self.stdout.write(self.style.SUCCESS('Created test activities'))

        # Create test leaderboard entries
        Leaderboard.objects.create(user=user1, team=team1, score=150)
        Leaderboard.objects.create(user=user2, team=team1, score=120)
        Leaderboard.objects.create(user=user3, team=team2, score=200)
        self.stdout.write(self.style.SUCCESS('Created test leaderboard entries'))

        # Create test workouts
        Workout.objects.create(
            user=user1, name='Morning Cardio',
            description='30 minutes of running followed by stretching',
            suggested_by=user2
        )
        Workout.objects.create(
            user=user2, name='HIIT Blast',
            description='High intensity interval training for 20 minutes',
            suggested_by=user1
        )
        Workout.objects.create(
            user=user3, name='Yoga Flow',
            description='45 minutes of yoga for flexibility and relaxation',
            suggested_by=user3
        )
        self.stdout.write(self.style.SUCCESS('Created test workouts'))

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
