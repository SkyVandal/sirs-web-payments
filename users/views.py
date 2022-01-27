import json
from django.shortcuts import render
from rest_auth.views import LoginView

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response


@api_view(["POST"])
#@permission_classes([AllowAny])
def login_user(request):

    data = {}
    reqBody = json.loads(request.body)
    cryptData = reqBody['cryptoData']
    print("Data encriptada", cryptData)
    return Response(data)