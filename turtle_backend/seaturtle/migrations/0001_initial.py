# Generated by Django 4.2.2 on 2023-06-30 02:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SeaTurtle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.IntegerField(unique=True)),
                ('story', models.TextField()),
                ('problem', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=200)),
                ('date', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='seaturtle.seaturtle')),
            ],
        ),
    ]
