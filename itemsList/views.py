from django.shortcuts import render
import stripe


stripe.api_key = 'sk_test_51KIxh6L9ToWAnoXmFiqHrT6mqO5FC71Th0UfrYpijVZbR1vTS4DXd9kHHBQFKsohc0QlIqWmN5mciT6GsSRI5I2q00DNJLZYHG'


def list_items():
    stripe.Product.list(limit=2)
