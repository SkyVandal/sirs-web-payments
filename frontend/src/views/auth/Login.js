import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';

// Global base 64 encoder/decoder
var base64js = require('base64-js');
const ncrypto = require("crypto");
//var Buffer = require('buffer/').Buffer;


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
  console.log("pemContents", pemContents);
  console.log("type of pemContents", typeof pemContents);
  const binaryDerString = window.atob(pemContents);
  //const binaryDerString = Buffer.from(pemContents, 'base64').toString();
  //window.atob()
  //const binaryDerString = base64js.toByteArray(pemContents).toString("base64");
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


function encryptKey(pubKey, symKey) {
  return ncrypto.publicEncrypt(
    {
      key: pubKey,
      padding: ncrypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(symKey)
  );
}

function buildSignature(data, key) {
  return ncrypto.sign("sha256", Buffer.from(data), {
    key: key,
    padding: ncrypto.constants.RSA_PKCS1_PSS_PADDING,
  });
}


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(true);
  
  
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
    //var userJson = JSON.stringify(user);

    // import client priv key
    const client_privKey = `-----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAsRbKtVKTN9VoPMlQTcD3+06qg75L9M86fHRwbEI6xZ5f/GF9
    ai45fdTFNQ2jHUx91bGZ/6IOLOZa67GO7Q6qEckQxSJM053Ywf8OrocBs4IwmCkz
    YhuAcf0bz85YTVxC/RsCOyal4PHVnEnV57ynQMGDP06LnkJPbXvTRO/TDvSEXOiw
    Aq6ONoiFaVnRuwJpsW1TbP8zRBgID7er5sEbRpOBGMi07empimBVM7EJiFUyX7GX
    zHRl5Kk/pK+goXuJJLJ+/pZF0iW7uYalmgWHxEnlbJJRBTwrnaP6Ehjk3H2Ro/BN
    WpT9EwNWgbRmHNvZE4g4BbmUiXfdoZDaYG+24wIDAQABAoIBAHo2LHauIgMqN+Gb
    XNwMDBdW1r5Mmca9LLOu99b+bejrv3pBHXglpm98YwyV+LfDjiPniUut3vKFlsGJ
    rAVVVXEovXYOkc6I5IodJ1iyuy3S7w5TgK54JFCGSKdE1BOvVFuwQ/3mUhvHSY+u
    NPzUaOh7o8QQxLHXOVFpXwf4KkPqvOyuzNxTePt9n25SW3Ig6V1YgbA7qmCIvU1O
    2yiariXLsfOe5cU9V6m7XqZug+8CsRf7Zbx+O3cjvxl6gCfMUQiaj2iJr+J7rS9K
    mek+wKZx6MTKzf0z9CJ1ShePFcy3QI9MS1j2ZrvGJf2x+BBw2dUDu5zfHB4CMZnz
    TnGzCOECgYEA4nwr7+fDyOzki3U3II/HNaq40U3E6Rns25KdID70xcmNS6qPZkLg
    fto6H9WugTG+Kq9+HbG9JUkryrmYDR/Ch3jv2v3cFwxnfFEnDDkdckohVAMP1jsg
    2cT4Dy1SWaj8OzvgYWJAZeknvEqxIG6ZDMhj/3NCgZT7mD25j3Ao9E0CgYEAyCq0
    3Ndgp3PxB35B1frp5yAHlT/SpdYbsx9Hdlp9745+F+koqI0tdHUKG+iiF4KiWZCo
    3CmXTm7kXorQbe68VHxl4Yu2lJZbvUBYe6y0UPKpQ1TLtP/BKAPcumRlM/1jPZmv
    o073j5yeh7IQ5FtShUI2TrYhtmSW/Uz9wd1/r+8CgYEArWgpM9wd2T8XlXc/qByt
    h/eY3hhPRbJl2ZAd4cySGMXC+0Yx2TgnLrjje/BdVenCEmifhRjLGzs03ljPhGzm
    wlbkPqXT14nVyidQYFlypEkBz5MwkvReqJ3Y17X5sVBjHu8vUyCo8d5cYBxIFe7Y
    HCNp/PJA33o0UFIiOyLDGJkCgYB0IQLJVVNIE2X1GPUNNgNaCiUcG+kUOYHci/sj
    2SBTSXIyYR0rnKyQcg6pXnAb/7g9CkZNZPvZj1CC4TpHbUhqI7nf/vSwhAM5awlq
    xyneBMrau2lr2y2vD36RzQlB/nIDHRTfREMwWIdI5rASLEFV+rITPGuWrAlFb9OR
    E/aulQKBgEax+/6gTvis7XDA/8C2q4eu0BZfABCQ9VF8uF0m+h/PFWyZZ6IYZ/Cy
    5jkc9+UIS6zZqwQTyqOVS1JN0v2sycHidbm9Kv+0WWWjj/A81r5cOmkepCrYW9L2
    1i4tTnI33NEoaKY/sRdOrzlh0h8yL2Gh4qcrTm+WDszoOfxpJ+fN
    -----END RSA PRIVATE KEY-----`;
    // import server pub key
    const server_pubKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5b0XrVaeiEI797RetipN
    m/gjMmKK5E8ywQNZP100WYq5mz4gf9EmJFnt3LSZjRkRtD+jOuNuSxRthrbRr5Tn
    HgwuAfodFvI10vKO+ObNBLfrF1Hy1xOl5WT9+9EkKdUv9RH/biqrIr3bXBpOY2jv
    Ps5JyUeXzrcTEJQ+4YYZK/laqT54H/Mu+SrN/jPryY7zUzjzHUcO5xXHo5LS/pMc
    XKNRglAOyZvFUn7ciq2SGWDOV54lj1EwaBbyVdIgWCxsUE+p3iMSUdB0VcRqRNyo
    Yq3PyPhglST4YVg5qGH2hZZLo71o0BEz4pliJPppl7s530YkCaMZYxG7v02xVfA9
    AwIDAQAB
    -----END PUBLIC KEY-----`;
    
    // Generate symm key and iv
    //const symKey = ncrypto.randomBytes(32);
    let symKey;
    let encryptedData;
    let encryptedKey;
    //const initVector = ncrypto.randomBytes(16);

    // Encript Data
    //var cipherData = await encryptAES(userJson, symKey);

    //const cipher = ncrypto.createCipheriv("aes-256-cbc", symKey, initVector);
    //let encryptedData = cipher.update(userJson, "utf-8", "binary");
    //encryptedData += cipher.final("binary");

    // Build sym+iv string

    //var symIv = Buffer.from(symKey).toString('ascii') + "IV=" + Buffer.from(initVector).toString('ascii');
    //var symIv = Buffer.from(symKey).toString('ascii');
    // encrypt (symm key+iv) with server pub key
    //var encryptedKey = encryptKey(server_pubKey, symIv).toString('binary');
    // build signature
    //const auth_signature = buildSignature(userJson, client_privKey);


    /*var b64Hash = Buffer.from(encryptedHash).toString('base64');
    var b64Data = Buffer.from(encryptedData).toString('base64');
    var b64Key = Buffer.from(encryptedKey).toString('base64');*/

    const packet = {
      //signature: auth_signature,
      cryptoData: encryptedData,
      cryptoKkey: encryptedKey,
      //iv: initVector.toString('ascii')
    };

    console.log(encryptedKey);
    
    //https://127.0.0.1:8000/api/v1/users/auth/custom/login/
    fetch('https://127.0.0.1:8000/api/v1/users/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        console.log("data: ", data);
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