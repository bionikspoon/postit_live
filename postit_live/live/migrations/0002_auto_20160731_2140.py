# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-07-31 21:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('live', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='channel',
            name='resources_html',
            field=models.TextField(editable=False),
        ),
        migrations.AlterField(
            model_name='message',
            name='body_html',
            field=models.TextField(editable=False),
        ),
    ]