import json
from django.conf import settings
from django.shortcuts import render
from rest_auth.views import LoginView

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.response import Response

from Crypto.Cipher import AES, PKCS1_OAEP, PKCS1_v1_5
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5 as SigScheme
from base64 import b64decode

import rsa


@api_view(["POST"])
#@permission_classes([AllowAny])
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


