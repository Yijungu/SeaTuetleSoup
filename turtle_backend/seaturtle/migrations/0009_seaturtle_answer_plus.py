# Generated by Django 4.2.3 on 2023-07-25 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seaturtle', '0008_hint'),
    ]

    operations = [
        migrations.AddField(
            model_name='seaturtle',
            name='answer_plus',
            field=models.TextField(null=True),
        ),
    ]