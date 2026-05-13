from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Activity, Leaderboard, Workout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'created_at']

class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    class Meta:
        model = Activity
        fields = ['id', 'user', 'team', 'type', 'duration', 'distance', 'calories', 'date', 'created_at']

class LeaderboardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'team', 'score', 'created_at']

class WorkoutSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    suggested_by = UserSerializer(read_only=True)
    class Meta:
        model = Workout
        fields = ['id', 'user', 'name', 'description', 'suggested_by', 'created_at']
