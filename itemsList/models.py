from django.db import models
from items import Items


class ItemsList(models.Model):
    items = Items.objects.all()
