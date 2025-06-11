from rest_framework import serializers
from .models import TeamMember, Role, Permission
import re

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        source='permissions',
        many=True,
        required=False,
        write_only=True
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'permissions', 'permission_ids', 'is_admin', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TeamMemberSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source='role',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = TeamMember
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'role', 'role_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_phone_number(self, value):
        if not value:
            raise serializers.ValidationError("Phone number is required")
            
        # Validate phone number format (XXX) XXX-XXXX
        phone_pattern = r'^\(\d{3}\) \d{3}-\d{4}$'
        if not re.match(phone_pattern, value):
            raise serializers.ValidationError("Please enter a valid phone number in the format (XXX) XXX-XXXX")
            
        return value 