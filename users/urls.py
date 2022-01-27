from django.urls import include, path

urlpatterns = [
path('auth/register/', include('rest_auth.registration.urls')),
path('auth/', include('rest_auth.urls'))
]