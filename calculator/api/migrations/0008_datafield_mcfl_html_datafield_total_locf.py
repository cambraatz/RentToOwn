# Generated by Django 5.0.1 on 2024-01-23 03:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_datafield_mcfu_gross_sale_30y_datafield_mcfu_table_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='datafield',
            name='mcfl_html',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='datafield',
            name='total_locf',
            field=models.FloatField(default=0, max_length=10),
        ),
    ]