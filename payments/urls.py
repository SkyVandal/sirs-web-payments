from django.urls import path
from payments.views import StripeCheckoutView


urlpatterns = [
    path('create-checkout-session', StripeCheckoutView.as_view()),
]
