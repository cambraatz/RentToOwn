# Generated by Django 5.0.1 on 2024-02-13 21:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_datafield_mcf_interest'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datafield',
            name='mcf_interest',
        ),
    ]
