from django.db import models

class Item(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=40)
    price = models.CharField(max_length=10)

    def __str__(self):
        return self.title