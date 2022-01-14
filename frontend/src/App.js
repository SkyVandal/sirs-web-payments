import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";

import {Navigation} from "./components/Navigation";
import {HomePage} from "./components/HomePage";
import {Contacts} from "./components/Contacts";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: true,
    };
  }

  render() {
    return (
        <Navigation />,
        <Contacts />
    )
  }
}

export default App;
