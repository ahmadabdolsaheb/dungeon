import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var hidth = 10;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      grid:1 //this.nextMove()
    };
  };
  fullArray = () => {
    var array = [];
    for (var i = 0; i < hidth; i++) {
      array.push(new Array);
      for (var j = 0; j < hidth; j++) {
        array[i].push(1);
      }
    }
  };
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>RUNNING</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
