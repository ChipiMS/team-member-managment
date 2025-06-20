from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, RoleViewSet, PermissionViewSet

router = DefaultRouter()
router.register(r'team-members', TeamMemberViewSet, basename='teammember')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'permissions', PermissionViewSet, basename='permission')

urlpatterns = [
    path('', include(router.urls)),
] 