# Generated by Django 5.0.2 on 2025-03-23 11:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clinics', '0003_remove_vetclinic_latitude_remove_vetclinic_longitude_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='VetRecord',
        ),
    ]
