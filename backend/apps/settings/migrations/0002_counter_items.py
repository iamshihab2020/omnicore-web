# Generated by Django 5.2.3 on 2025-06-13 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0003_alter_menuitem_options_remove_menuitem_calories_and_more'),
        ('settings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='counter',
            name='items',
            field=models.ManyToManyField(blank=True, related_name='counters', to='menu.menuitem'),
        ),
    ]
