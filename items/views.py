from django.shortcuts import render
from django.http import HttpResponse

from items.models import Item

# Create your views here.
def main(request):
    return HttpResponse('Hello items views')

def itemsList(request):
    items = Item.objects.all()
    #print("items: " , items)
    return HttpResponse(items)