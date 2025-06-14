# Generated by Django 5.0.2 on 2025-06-11 12:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team_members', '0006_alter_teammember_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teammember',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='team_members', to='team_members.role'),
        ),
    ]
