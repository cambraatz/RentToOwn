# Generated by Django 5.0.1 on 2024-01-22 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_remove_datafield_pub_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='datafield',
            name='mcf_table',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='datafield',
            name='total_rcf',
            field=models.FloatField(default=0, max_length=10),
        ),
    ]