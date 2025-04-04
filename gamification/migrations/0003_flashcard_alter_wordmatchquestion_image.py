# Generated by Django 5.1.7 on 2025-03-29 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gamification', '0002_wordmatchquestion_leaderboard_game_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Flashcard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sign_image', models.ImageField(upload_to='flashcards/')),
                ('correct_word', models.CharField(max_length=255)),
                ('option1', models.CharField(max_length=255)),
                ('option2', models.CharField(max_length=255)),
                ('option3', models.CharField(max_length=255)),
            ],
        ),
        migrations.AlterField(
            model_name='wordmatchquestion',
            name='image',
            field=models.ImageField(upload_to='word-match/'),
        ),
    ]
