from django.urls import include, path
from .views import itemsList

urlpatterns = [
    path('itemslist/', itemsList),
]
