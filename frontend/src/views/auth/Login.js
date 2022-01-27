import React, { useState, useEffect } from 'react';
//import { Buffer } from 'buffer';

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

async function generateSymmetricKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptAES(message, key) {
  let encoded = new TextEncoder().encode(message);
  var iv = window.crypto.getRandomValues(new Uint8Array(16));

  return await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv
    },
    key,
    encoded
  );
}

async function importRSApublicKey(publicServerpem) {

  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = publicServerpem.substring(pemHeader.length, publicServerpem.length - pemFooter.length);
  const binaryDerString = window.atob(pemContents);
  const arrayBukkerKey = str2ab(binaryDerString);

  return await window.crypto.subtle.importKey(
    "spki",
    arrayBukkerKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );

}

async function messageDigest(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  var hashArray = await crypto.subtle.digest('SHA-256', data);
   // digested message byte array
  const hashHex = Array.prototype.map.call(new Uint8Array(hashArray),b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

async function encryptRSA(message, key) {

  const data = new TextEncoder().encode(message);

  return await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    data
  );
}

async function encryptKey(pubKey, symKey) {
  const data = new TextEncoder().encode(symKey.toString("base64"));

  return await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    pubKey,
    data
  );
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(true);
  
    var publicServerpem = `-----BEGIN PUBLIC KEY-----
      MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwynl7PXKTZvbAQGHxE2B
      dpL5YC+Fa5PCdXd488CY8QouhhgkupLdzivRy6GoCTovw1JV5ZO0CjLGKwCsGpPm
      dQM7JVfgrHCRozDMR4GCBwvdVlbl+hlG48CPdqfBZ5B8oKMXyQoxMKGlD3Wty7gK
      qrIHXalgKNVMSztR1wDQgG99b2gnQeTBeAucSwRK+E9oVTRNM6F1py2lzlR29i15
      YUMUeA26DF++L1hvfGMwL/lWrysRQqLQsTBKVpqdfZ9sFKJ0CrfhzpjgcvSZgRWW
      d6RVs/vfflfv+R61/+OlBgYkiQfN+WC0HQAahT2ndYef9Tk9gvGUbdgZsuKOMg4X
      xwIDAQAB
      -----END PUBLIC KEY-----`;
  
  useEffect(() => {
      if (localStorage.getItem('token') !== null) {
        window.location.replace('https://localhost:3000/dashboard');
      } else {
        setLoading(false);
      }
    }, []);
  
    
  
  const onSubmit = async e => {
    e.preventDefault();
  
    const user = {
      email: email,
      password: password  
     
    };
    
    var userJson = JSON.stringify(user);

      // Hash message (user info)
    var digest = await messageDigest(userJson);
    //console.log("digest:", digest);

    let publicServerKey = await importRSApublicKey(publicServerpem);
    //console.log("key:", publicServerKey);
    
      // encrypt hash
    var encryptedHash = await encryptRSA(digest, publicServerKey);
    //console.log("cryptoHash:", encryptedHash)
    // Generate symmetric key
    var symmetricKey = await generateSymmetricKey();
    //console.log("symmetric key:", symmetricKey);

    var encryptedData = await encryptAES(userJson, symmetricKey);
    //console.log("cryptoData:", encryptedData);
    var encryptedKey = await encryptKey(publicServerKey, symmetricKey);
    //console.log("cryptoKey:", encryptedKey);


    var base64js = require('base64-js');
    var b64Hash = base64js.fromByteArray(new Uint8Array(encryptedHash));
    var b64Data = base64js.fromByteArray(new Uint8Array(encryptedData));
    var b64Key = base64js.fromByteArray(new Uint8Array(encryptedKey));

    //console.log("hash64: ", b64Hash);
    //console.log("data64: ", b64Data);
    //console.log("64key: ", b64Key);

    /* Security contents:
      * encrypted hashed data: Kserverpub(H(data))        
      * encrypted data(w/symmetric key): K(data)
      * encrypted symmetric key(w/server pub key): Kserverpub(K)
    */
    const packet = {
      cryptoHash: b64Hash,
      cryptoData: b64Data,
      cryptoKkey: b64Key
    };
    
    //https://127.0.0.1:8000/api/v1/users/auth/login/
    fetch('https://127.0.0.1:8000/api/v1/users/auth/custom/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(packet)
    })
      .then(res => res.json())
      .then(data => {
        //console.log("data: ", data);
        if (data.key) {
          localStorage.clear();
          localStorage.setItem('token', data.key);
          window.location.replace('https://localhost:3000/dashboard');
        } else {
          setEmail('');
          setPassword('');
          localStorage.clear();
          setErrors(true);
        }
      });
  };
  
    return (
      <div>
        {loading === false && <h1>Login</h1>}
        {errors === true && <h2>Cannot log in with provided credentials</h2>}
        {loading === false && (
          <form onSubmit={onSubmit}>
            <label htmlFor='email'>Email address:</label> <br />
            <input
              name='email'
              type='email'
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />{' '}
            <br />
            <label htmlFor='password'>Password:</label> <br />
            <input
              name='password'
              type='password'
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />{' '}
            <br />
            <input type='submit' value='Login' />
          </form>
        )}
      </div>
    );
  };
  
  export default Login;