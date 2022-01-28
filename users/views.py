import email
from email import message
import json
from django.shortcuts import render
from rest_framework.exceptions import ValidationError

from .models import User
from django.contrib.auth import authenticate, login

from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import binascii
import base64

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK
)


import rsa


@api_view(["POST"])
@permission_classes([AllowAny,])
def login_user(request):
    private_key = RSA.import_key(open(settings.SERVER_PRIVATE_KEY, "r").read())
    client_public_key = RSA.import_key(open(settings.CLIENT_PUBLIC_KEY, "r").read())

    cipher_rsa = PKCS1_v1_5.new(private_key)

    signature_scheme = SigScheme.new(private_key)

    data_dict = json.load(request)

    signature = data_dict["signature"] #signature /verify
    crypto_data = data_dict["cryptoData"] #bytes use symmetric
    sym_key = data_dict["cryptoKkey"] #usar privada (bytes)
    iv = data_dict["iv"] #string

    #ERROR
    sym_key_decripted = cipher_rsa.decrypt(sym_key, sentinel="encryption failed")

    #decrypt crypto_data with symmetric key

    #verify signature
    signer = PKCS1_v1_5.new(client_public_key)
    digest = SHA256.new()
    digest.update(b64decode(crypto_data))
    #if signer.verify(digest, b64decode(signature)):
    #    verified = True
    #verified = False
    data = {}
    return Response(data)


def export_key(private_key):
    with open(settings.SERVER_PRIVATE_KEY, "wb") as file:
        file.write(private_key.exportKey('PEM'))
        file.close()
    public_key = private_key.publickey()
    with open(settings.SERVER_PUBLIC_KEY, "wb") as f:
        f.write(public_key.exportKey('PEM'))
        f.close()


def generateToken(mail, passw, request):
    try:
        Account = User.objects.get(email=mail)
    except BaseException as e:
        raise ValidationError({"400": f'{str(e)}'})
    
    # Generate token
    token = Token.objects.get_or_create(user=Account)[0].key
    print(token)

    if not passw == Account.password:
        raise ValidationError({"message": "Incorrect Login credentials"})
    
    if Account:
        if Account.is_active:
            login(request, Account, backend="django.contrib.auth.backends.ModelBackend")
            return Response({"token": token}, status=HTTP_200_OK)
        else:
            raise ValidationError({"400":f'Account not active'})
    else:
        raise ValidationError({"400": f'Account does not exist'})
    