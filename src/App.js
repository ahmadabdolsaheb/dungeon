import React, { Component } from 'react';
import './App.css';
var hidth = 5;
//const levelPlus7 = 7
var Levels = [
  {player: 2},
  {health: 3},
  {stairs: 7},
  {weapon: 4},
  {enemy: 5},
  {enemy: 5},
  {health: 3},
  {weapon: 4},
  {health: 3},
  {enemy: 5},
  {boss: 6}
];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      health: 100,
      enemHealth: 50,
      bossHealth: 500,
      weapon: "fist",
      level:1,
      grid:this.randSetter()
    };
  }
  fullArray = () => {
    var array = [];
    for (var i = 0; i < hidth; i++) {
      array.push([]);
      for (var j = 0; j < hidth; j++) {
        array[i].push(1);
      }
    }
    return array;
  }
  nextMove = () => {
    var openArr = [];
    var maxTurn = 10; // the number of turns the tunnel has
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
          openArr.push([curRow, curCol]);//save this open location
        //break the loop if it is going out of the map
          if(curRow === 0 && randTurn[0] === -1 ||
             curCol === 0 && randTurn[1] === -1 ||
             curRow === hidth - 1 && randTurn[0] === 1 ||
             curCol === hidth - 1 && randTurn[1] === 1){
            break
          }else{
         //otherwise incriment the row and col according to the turn
            curRow += randTurn[0];
            curCol += randTurn[1];
          }
      }
      lastTurn = randTurn;//set last turn to the value of the current turn
      maxTurn--;// decrement the number of turns allowed
    }
    console.log( fulArr);
    console.log(this.uniqBy(openArr, JSON.stringify));
    return fulArr;// finally retun the array to be drawn

  }
  uniqBy = (a, key) => {
     var seen = {};
     return a.filter(function(item) {
       var k = key(item);
       return seen.hasOwnProperty(k) ? false : (seen[k] = true);
     })
   }
  randSetter = (levels, level) => {
    return this.nextMove();
  }
  render() {

    return (
      <div>
  <table className="grid">
    {this.state.grid.map((obj, row) =>
        <tr className="">
            {obj.map((obj2, col) =>
                <td className={obj2 ? 'wall' : ''} key={Number(""+ row + col)}>{obj2}</td>
        )}</tr>
    )}
  </table>
</div>
    );
  }
}

export default App;
