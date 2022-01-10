from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ItemsSerializer
from .models import Items


class ItemsView(viewsets.ModelViewSet):
    serializer_class = ItemsSerializer
    queryset = Items.objects.all()
