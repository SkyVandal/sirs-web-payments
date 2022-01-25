import React, { useState, useEffect } from 'react';

function messageDigest(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashArray = crypto.subtle.digest('SHA-256', data); // digested message byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

function encrypt(message, key) {

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
    
    //const digest = await window.crypto.subtle.digest('SHA-256', data);
  //const digest = await window.crypto.subtle.digest();
  
    const onSubmit = e => {
      e.preventDefault();
  
      const user = {
        /* This will be encrypted */
        email: email,
        password: password  
        /* Security contents:
        encrypted hashed data: Kpriv(H(data))        
        encrypted data(w/symmetric key): K(data)
        encrypted symmetric key(w/server pub key): Kserverpub(K)
        */
      };
      var userJson = JSON.stringify(user);

      // Hash message (user) and encrypt it with my priv key
      var hashMessage = messageDigest(userJson);



      const packet = {

      };
  
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