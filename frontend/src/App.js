import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './views/auth/Login'; 
import Signup from './views/auth/Signup';
import Logout from './views/auth/Logout';
import ItemsList from './components/ItemsList';
import Singleitem from './components/Singleitem';
import axios from "axios";
import React, { useState, useEffect, setState, Component } from 'react';



class App extends Component {
  
  state = {
    items: []
  };

  /*useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/items/itemslist/")
        .then(response => {
        
          var listItems = response.data.map(c => {
            return {
              id: c.id,
              title: c.title,
              description: c.description,
              price: c.price
            };
          });
        
          const newState = Object.assign({}, state,
            { items: listItems }
          );
          this.setState(newState);
        })
        .catch(error => console.log(error));
  })*/

  componentDidMount() {
    axios
      .get("https://127.0.0.1:8000/api/items/itemslist/")
        .then(response => {
        
          var listItems = response.data.map(c => {
            return {
              key: c.id,
              title: c.title,
              description: c.description,
              price: c.price
            };
          });
        
          const newState = Object.assign({}, this.state,
            { items: listItems }
          );
          this.setState(newState);
        })
        .catch(error => console.log(error));
  }


  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <ItemsList items={this.state.items} />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/logout' element={<Logout />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
