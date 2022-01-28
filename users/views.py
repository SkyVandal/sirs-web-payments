import email
from email import message
import json
from django.forms import ValidationError
from django.shortcuts import render
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

    message = {
        "email": "alexandre@gmail.com",
        "password": "password"
    }
    sentence = "Hello World!"
    messageJson = json.loads(json.dumps(message))
    #Generate key pair
    keyPair = RSA.generate(3072)
    #pub key
    pub_key = keyPair.publickey()
    print(f"Public key:  (n={hex(pub_key.n)}, e={hex(pub_key.e)})")
    pubKeyPEM = pub_key.exportKey()
    print(pubKeyPEM.decode('ascii'))
    #private key
    print(f"Private key: (n={hex(pub_key.n)}, d={hex(keyPair.d)})")
    privKeyPEM = keyPair.exportKey()
    print(privKeyPEM.decode('ascii'))
    #encrypt a message
    encryptor = PKCS1_OAEP.new(pub_key)
    #cipherTextJson = encryptor.encrypt(messageJson)
    cipherTextSentence = encryptor.encrypt(sentence)
    #convert to base 64
    #cipherJson_bytes = cipherTextJson.encode('ascii')
    ###cipherSentence_bytes = cipherTextSentence.encode('ascii')
    #json_b64_bytes = base64.b64encode(cipherJson_bytes)
    ###sentence_b64_bytes = base64.b64encode(cipherSentence_bytes)
    #json_b64_message = json_b64_bytes.decode('ascii')
    ###sentence_b64_message = sentence_b64_bytes.decode('ascii')
    #decrypt a message
    ## first we have to decode from base 64
    #json_base64_bytes = json_b64_message.encode('ascii')
    ###sentence_base64_bytes = sentence_b64_message.encode('ascii')
    #json_decoded_bytes = base64.b64decode(json_base64_bytes)
    ###sentence_decoded_bytes = base64.b64decode(sentence_base64_bytes)
    #now we decript
    #cipherJson = json_decoded_bytes.decode('ascii')
    ###cipherSentence = sentence_decoded_bytes.decode('ascii')
    decryptor = PKCS1_OAEP.new(keyPair)
    #decrypted_json = decryptor.decrypt(cipherJson)
    decrypted_sentence = decryptor.decrypt(cipherTextSentence)
    print("sentence: " + decrypted_sentence)

    #Generate symmetric AES-CBC key

    #Encrypt data with symmetric

    #encrypt symmetric key with publicKey

    #decrypt symmetric with private key

    #decrypt data with symmetric
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