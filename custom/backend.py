from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth.backends import BaseBackend
import json

from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from base64 import b64decode


class CustomAuthentication(BaseBackend):
    private_key = open(settings.SERVER_PRIVATE_KEY, "r").read()
    rsa_private_key = RSA.importKey(private_key)

    client_pub_key = open(settings.CLIENT_PUBLIC_KEY, "r").read()
    rsa_client_public_key = RSA.importKey(client_pub_key)

    def authenticate(self, request=None, email=None, password=None, **kwargs):
        if request is not None:
            return User.objects.get(email=email) if self.user_is_auth(request) else None
        print("Deu merda, debug")
        return User.objects.get(email=email)

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def user_is_auth(self, request):
        if request is None:
            return True #careful
        print(request)
        data_dict = json.load(request)

        data_hash = data_dict["cryptoHash"]
        data = data_dict["cryptoData"]
        sym_key = data_dict["cryptoKkey"]

        raw_hash_data = b64decode(data_hash)
        decrypted_hash = self.rsa_private_key.decrypt(raw_hash_data)

        raw_key_data = b64decode(sym_key)
        decrypted_key = self.rsa_private_key.decrypt(raw_key_data)

        raw_data = b64decode(data)
        aes = AES.new(decrypted_key, AES.MODE_CBC)
        decrypted_data = aes.decrypt(raw_data)

        new_hash_data = SHA256.new(decrypted_data)

        return new_hash_data == decrypted_hash




