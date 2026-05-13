from django.test import TestCase
from django.contrib.auth.models import User
from .models import Team, Activity, Workout

class TeamModelTest(TestCase):
    def test_create_team(self):
        user = User.objects.create_user(username='testuser', password='pass')
        team = Team.objects.create(name='Test Team')
        team.members.add(user)
        self.assertEqual(team.name, 'Test Team')
        self.assertIn(user, team.members.all())

class ActivityModelTest(TestCase):
    def test_create_activity(self):
        user = User.objects.create_user(username='testuser', password='pass')
        activity = Activity.objects.create(user=user, type='run', duration=30, date='2024-01-01')
        self.assertEqual(activity.type, 'run')
        self.assertEqual(activity.duration, 30)

class WorkoutModelTest(TestCase):
    def test_create_workout(self):
        user = User.objects.create_user(username='testuser', password='pass')
        workout = Workout.objects.create(user=user, name='Pushups', description='Do 20 pushups')
        self.assertEqual(workout.name, 'Pushups')
