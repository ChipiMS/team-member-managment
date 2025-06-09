from django.test import TestCase
from django.urls import reverse, get_resolver
from rest_framework.test import APITestCase
from rest_framework import status
from .models import TeamMember, Role, Permission

# Print all available URL patterns
resolver = get_resolver()
print("Available URL patterns:")
for url_pattern in resolver.url_patterns:
    print(f"URL pattern: {url_pattern}")

class PermissionAPITests(APITestCase):
    def setUp(self):
        self.permission = Permission.objects.create(name='test_permission')
        self.url = reverse('permission-list', args=[])

    def tearDown(self):
        Permission.objects.all().delete()

    def test_create_permission(self):
        data = {'name': 'new_permission'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Permission.objects.count(), 3)
        self.assertEqual(Permission.objects.get(name='new_permission').name, 'new_permission')

    def test_get_permissions(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_permission_detail(self):
        url = reverse('permission-detail', args=[self.permission.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'test_permission')

    def test_update_permission(self):
        url = reverse('permission-detail', args=[self.permission.id])
        data = {'name': 'updated_permission'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Permission.objects.get(id=self.permission.id).name, 'updated_permission')

    def test_delete_permission(self):
        url = reverse('permission-detail', args=[self.permission.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Permission.objects.count(), 1)

class RoleAPITests(APITestCase):
    def setUp(self):
        self.permission = Permission.objects.create(name='test_permission')
        self.role = Role.objects.create(name='test_role', is_admin=False)
        self.role.permissions.add(self.permission)
        self.url = reverse('role-list', args=[])

    def tearDown(self):
        Role.objects.all().delete()
        Permission.objects.all().delete()

    def test_create_role(self):
        data = {
            'name': 'new_role',
            'is_admin': False,
            'permissions': [self.permission.id]
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Role.objects.count(), 4)
        self.assertEqual(Role.objects.get(name='new_role').name, 'new_role')

    def test_get_roles(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_role_detail(self):
        url = reverse('role-detail', args=[self.role.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'test_role')

    def test_update_role(self):
        url = reverse('role-detail', args=[self.role.id])
        data = {
            'name': 'updated_role',
            'is_admin': True,
            'permissions': [self.permission.id]
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Role.objects.get(id=self.role.id).name, 'updated_role')

    def test_delete_role(self):
        url = reverse('role-detail', args=[self.role.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Role.objects.count(), 2)

class TeamMemberAPITests(APITestCase):
    def setUp(self):
        self.permission = Permission.objects.create(name='test_permission')
        self.role = Role.objects.create(name='test_role', is_admin=False)
        self.role.permissions.add(self.permission)
        self.team_member = TeamMember.objects.create(
            first_name='John',
            last_name='Doe',
            email='john@example.com',
            phone_number='1234567890',
            role=self.role
        )
        self.url = reverse('teammember-list', args=[])

    def tearDown(self):
        TeamMember.objects.all().delete()
        Role.objects.all().delete()
        Permission.objects.all().delete()

    def test_create_team_member(self):
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com',
            'phone_number': '0987654321',
            'role': self.role.id
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TeamMember.objects.count(), 2)
        self.assertEqual(TeamMember.objects.get(email='jane@example.com').first_name, 'Jane')

    def test_get_team_members(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_team_member_detail(self):
        url = reverse('teammember-detail', args=[self.team_member.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'john@example.com')

    def test_update_team_member(self):
        url = reverse('teammember-detail', args=[self.team_member.id])
        data = {
            'first_name': 'John',
            'last_name': 'Updated',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'role': self.role.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(TeamMember.objects.get(id=self.team_member.id).last_name, 'Updated')

    def test_delete_team_member(self):
        url = reverse('teammember-detail', args=[self.team_member.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TeamMember.objects.count(), 0)

    def test_create_team_member_without_role(self):
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com',
            'phone_number': '0987654321'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TeamMember.objects.get(email='jane@example.com').role, None)

    def test_create_team_member_with_duplicate_email(self):
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'john@example.com',
            'phone_number': '0987654321',
            'role': self.role.id
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
