# Generated by Django 5.0.1 on 2024-01-30 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_mcfu_gross_sale_30y_datafield_gross_sale_30y_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='datafield',
            name='mcfr_table',
            field=models.TextField(default=''),
        ),
    ]
