import email
import json
from django.forms import ValidationError
from django.shortcuts import render
from .models import User
from django.contrib.auth import authenticate, login

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK
)

# Test api
"""
@api_view(["GET"])
@permission_classes([IsAuthenticated, ])
def sample_api(request):
    data = {'sample_data': 123}
    return Response(data, status=HTTP_200_OK)
"""

@api_view(["POST"])
@permission_classes([AllowAny,])
def login_user(request):
    
    print("CHEGUEI AQUI")
    return Response({})
    mail = request.data.get("email")
    passw = request.data.get("password")

    # Opcao 1
    
    try:
        Account = User.objects.get(email=mail)
    except BaseException as e:
        raise ValidationError({"400": f'{str(e)}'})
    
    # Generate token
    token = Token.objects.get_or_create(user=Account)[0].key
    print(token)

    if not passw==Account.password:
        raise ValidationError({"message": "Incorrect Login credentials"})
    
    if Account:
        if Account.is_active:
            login(request, Account, backend="django.contrib.auth.backends.ModelBackend")
            return Response({"token": token}, status=HTTP_200_OK)
        else:
            raise ValidationError({"400":f'Account not active'})
    else:
        raise ValidationError({"400": f'Account does not exist'})
    
    """
    # OPCAO 2
    #user = authenticate(email=emaildesencriptado, password=passdesencriptada)
    print("email: " + mail + "\npassword: " + passw + "\n")
    user = authenticate(email=mail, password=passw)
    print(user)
    if user is not None:
        # Authenticated credentials
        # Generate token
        print("USER IS VALID")
        token = Token.objects.get_or_create(user=user)[0].key
        print(token)
        return Response({"token": token}, status=HTTP_200_OK)
    else:
        print("USER NOT VALID")
        raise ValidationError({"error": "Incorrect Login credentials"})
    """