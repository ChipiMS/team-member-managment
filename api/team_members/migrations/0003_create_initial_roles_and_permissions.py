from django.db import migrations

def create_initial_roles_and_permissions(apps, schema_editor):
    Permission = apps.get_model('team_members', 'Permission')
    Role = apps.get_model('team_members', 'Role')

    # First, clean up any duplicate permissions
    Permission.objects.filter(name='Can delete members').delete()

    # Create permission
    delete_members_permission = Permission.objects.create(
        name='Can delete members'
    )

    # Create or get roles
    regular_role, _ = Role.objects.get_or_create(
        name='Regular - Can\'t delete members'
    )

    admin_role, _ = Role.objects.get_or_create(
        name='Admin - Can delete members'
    )
    
    # Clear existing permissions and add the correct one
    admin_role.permissions.clear()
    admin_role.permissions.add(delete_members_permission)

def reverse_initial_roles_and_permissions(apps, schema_editor):
    Permission = apps.get_model('team_members', 'Permission')
    Role = apps.get_model('team_members', 'Role')

    # Delete roles first (due to foreign key constraints)
    Role.objects.filter(name__in=[
        'Regular - Can\'t delete members',
        'Admin - Can delete members'
    ]).delete()

    # Delete permissions
    Permission.objects.filter(name='Can delete members').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('team_members', '0002_permission_role_alter_teammember_role'),
    ]

    operations = [
        migrations.RunPython(
            create_initial_roles_and_permissions,
            reverse_initial_roles_and_permissions
        ),
    ] 