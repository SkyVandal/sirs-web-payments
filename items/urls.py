from django.urls import include, path
from .views import main, itemsList

urlpatterns = [
    path('itemslist/', itemsList),
]
