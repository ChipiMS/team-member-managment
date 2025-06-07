from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, RoleViewSet, PermissionViewSet

router = DefaultRouter()
router.register(r'team-members', TeamMemberViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'permissions', PermissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 