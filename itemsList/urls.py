from .views import list_items
from django.conf.urls import url


urlpatterns = [
    url(r'^list-items/$', list_items),
]