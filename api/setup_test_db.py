import os
import django
from django.core.management import call_command

# Set the environment variable for test database
os.environ['CYPRESS_TESTING'] = 'true'

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'team_member_management.settings')
django.setup()

def setup_test_db():
    """Set up the test database for Cypress tests."""
    # Remove existing test database if it exists
    if os.path.exists('test_db.sqlite3'):
        os.remove('test_db.sqlite3')
    
    # Run migrations on test database
    call_command('migrate')
    
    # Create test data
    from team_members.models import Permission, Role, TeamMember
    
    # Create permissions
    permissions = [
        Permission.objects.create(name='view_team_members'),
        Permission.objects.create(name='edit_team_members'),
        Permission.objects.create(name='delete_team_members'),
        Permission.objects.create(name='manage_roles'),
    ]
    
    # Create roles
    admin_role = Role.objects.create(
        name='Admin',
        is_admin=True
    )
    admin_role.permissions.set(permissions)
    
    developer_role = Role.objects.create(
        name='Developer',
        is_admin=False
    )
    developer_role.permissions.set([permissions[0], permissions[1]])
    
    # Create team members
    TeamMember.objects.create(
        first_name='John',
        last_name='Doe',
        email='john@example.com',
        phone_number='(123) 456-7890',
        role=admin_role
    )
    
    TeamMember.objects.create(
        first_name='Jane',
        last_name='Smith',
        email='jane@example.com',
        phone_number='(098) 765-4321',
        role=developer_role
    )

if __name__ == '__main__':
    setup_test_db() 