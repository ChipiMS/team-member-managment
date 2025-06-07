from django.shortcuts import render
from rest_framework import viewsets
from .models import TeamMember, Role, Permission
from .serializers import TeamMemberSerializer, RoleSerializer, PermissionSerializer

# Create your views here.

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
