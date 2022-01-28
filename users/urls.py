from django.urls import include, path
from .views import login_user

urlpatterns = [
path('auth/register/', include('rest_auth.registration.urls')),
#path('auth/custom/login/', login_user),
path('auth/', include('rest_auth.urls'))
]