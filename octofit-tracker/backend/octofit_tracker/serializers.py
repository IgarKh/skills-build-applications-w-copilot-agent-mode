from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Activity, Leaderboard, Workout


class ObjectIdStringMixin:
    def get_id(self, obj):
        primary_key = getattr(obj, 'pk', None)
        return str(primary_key) if primary_key is not None else None


class UserSerializer(ObjectIdStringMixin, serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TeamSerializer(ObjectIdStringMixin, serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'created_at']

class ActivitySerializer(ObjectIdStringMixin, serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source='user', queryset=User.objects.all(), write_only=True, required=False
    )
    team_id = serializers.PrimaryKeyRelatedField(
        source='team', queryset=Team.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Activity
        fields = [
            'id',
            'user',
            'user_id',
            'team',
            'team_id',
            'type',
            'duration',
            'distance',
            'calories',
            'date',
            'created_at',
        ]

class LeaderboardSerializer(ObjectIdStringMixin, serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'team', 'score', 'created_at']

class WorkoutSerializer(ObjectIdStringMixin, serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    suggested_by = UserSerializer(read_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'user', 'name', 'description', 'suggested_by', 'created_at']
