from django.db import models


class Items(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    price = models.FloatField()

    def _str_(self):
        return self.title
