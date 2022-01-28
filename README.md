# sirs-web-payments

Ativar sempre o ambiente virtual!
conda activate <nome do env>
  
python manage.py makemigrations 

python manage.py migrate (update na base de dados, correr sempre que se adiciona uma app ou um model)

### Run django Restfull backend API with HTTP
    python manage.py runserver

### Run django Restfull backend API with HTTPS (SSL/TLS handshake)
    python manage.py runserver_plus --cert-file certificates/cert.pem --key-file certificates/key.pem

(https://timonweb.com/django/https-django-development-server-ssl-certificate/)

encriptar com privada do client, verificar no servidor com a publica do client.

### Genarate private key
    openssl genrsa -out private-key.key

### Generate public key from private key
    openssl rsa -in private-key.pem -pubout -out public-key.pem

 conda install -c conda-forge pycryptodome 

 conda install -c conda-forge rsa 

npm install base64-js

npm install buffer