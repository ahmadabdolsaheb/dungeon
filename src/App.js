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
  }
  fullArray = () => {
    var array = [];
    for (var i = 0; i < hidth; i++) {
      array.push(new Array);
      for (var j = 0; j < hidth; j++) {
        array[i].push(1);
      }
    }
  }
  nextMove = () => {
    var maxTurn = 30; // the number of turns the tunnel has
    var maxLength = 6; // maximum number of each turn can have
    var fulArr = this.fullArray(); // save a full array;
    var curRow = Math.floor(Math.random() * hidth);// pick a random row
    var curCol = Math.floor(Math.random() * hidth);// pick a random column
    var calcObject = [[-1, 0],[1, 0],[0, -1],[0, 1]];// turns allowed are horizontal right/left and vertical right/left
    var lastTurn = [3, 3];// a variable to save the last turn it could have any non -1,0,1 value
    while (maxTurn) {// while number of allowed turns are not 0 do the following
      var randTurn;// initiate variable for the turn
      do {// do the following and check to see if passes the condition
        randTurn = calcObject[Math.floor(Math.random() * calcObject.length)];//randomly choose a turn
        //if the player is at the edge of the map and the random turn wants to push it off map select another turn
        //if the turn is similar to the previously selected turn or is reverse of the previous turn select another turn
      } while (randTurn[0] === -1 * lastTurn[0] && randTurn[1] === -1 * lastTurn[1] ||
               randTurn[0] === lastTurn[0] && randTurn[1] === lastTurn[1]);
      var leng = Math.ceil(Math.random() * maxLength);//randomly choose a length form the maximum allowed length
      for (var i = 0; i < leng; i++) {//loop over the length
          fulArr[curRow][curCol] = 0;//set the value of the item to 0
        //break the loop if it is going out of the map
          if(curRow === 0 && randTurn[0] === -1 ||
             curCol === 0 && randTurn[1] === -1 ||
             curRow === hidth - 1 && randTurn[0] === 1 ||
             curCol === hidth - 1 && randTurn[1] === 1){
            break
          }else{
         //otherwise incriment the row and col according to the turn
            curRow += randTurn[0];
            curCol += curCol + randTurn[1];
          }
      }
      lastTurn = randTurn;//set last turn to the value of the current turn
      maxTurn--;// decrement the number of turns allowed
    }
    return fulArr;// finally retun the array to be drawn
  }
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
