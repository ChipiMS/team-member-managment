from django.db import migrations

def update_roles_is_admin(apps, schema_editor):
    Role = apps.get_model('team_members', 'Role')
    
    # Update admin role
    admin_role = Role.objects.filter(name='Admin - Can delete members').first()
    if admin_role:
        admin_role.is_admin = True
        admin_role.save()
    
    # Update regular role
    regular_role = Role.objects.filter(name='Regular - Can\'t delete members').first()
    if regular_role:
        regular_role.is_admin = False
        regular_role.save()

def reverse_roles_is_admin(apps, schema_editor):
    Role = apps.get_model('team_members', 'Role')
    Role.objects.all().update(is_admin=False)

class Migration(migrations.Migration):
    dependencies = [
        ('team_members', '0004_role_is_admin'),
    ]

    operations = [
        migrations.RunPython(
            update_roles_is_admin,
            reverse_roles_is_admin
        ),
    ] 