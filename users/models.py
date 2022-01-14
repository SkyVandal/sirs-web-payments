from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=254)
    firstName = models.CharField(max_length=30)
    lastName = models.CharField(max_length=50)

    def __str__(self):
        return self.username