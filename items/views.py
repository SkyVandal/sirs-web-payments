from django.shortcuts import render
from django.http import HttpResponse

from items.models import Item
#from django.views.generic import ListView
from items.serializers import ItemSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def itemsList(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)