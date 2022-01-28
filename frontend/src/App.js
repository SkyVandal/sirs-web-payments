import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';
import Logout from './views/auth/Logout';
import {Navigation} from "./components/Navigation";
import {Contacts} from "./components/Contacts";


import {Checkout} from "./components/Checkout";
import {HomePage} from "./components/HomePage";


function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/logout' element={<Logout/>} />
        </Routes>
        <HomePage />
        <Contacts />
      </Router>
    </div>
  );
}

export default App;
