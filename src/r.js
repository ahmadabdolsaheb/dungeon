//larg
//tonum
//make the levels a function that accepts a state
//problem with binding thins
import React, { Component } from 'react';
import './App.css';
var hidth = 30;
const levelPlus6 = 6
var pLocate = [];
var levels = [];
var items = [
  ['player', 2,0,0],
  ['health', 3],
  ['stairs', 7],
  ['weapon', 4],
  ['enemy', 5,0,0,100],
  ['enemy', 5,100],
  ['health', 3],
  ['weapon', 4],
  ['health', 3],
  ['enemy', 5,0,0,100],
  ['boss', 6,0,0,100]
];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      health: 100,
      enemHealth: 50,
      bossHealth: 500,
      xp: 0,
      weapon: 1,
      level:1,
      grid:this.mapGen()
    };
    this.levels = this.levels.bind(this);
  }
  componentWillMount ()
  {
    //this.setState({date:this.full()})
  }
  componentDidMount () {
  this.centerScreen();
  document.addEventListener('keydown', this.controllerPress.bind(this));
  //document.addEventListener('keyup', this.controllerRelease.bind(this));
  }
  levels = (level) => {// returns a unique array
    return [
      ['player', 2],
      ['health', 3],
      ['stairs', 7],
      ['weapon', 4],
      ['enemy', 5, 100 * level],
      ['enemy', 5, 100 * level],
      ['health', 3],
      ['weapon', 4],
      ['health', 3],
      ['enemy', 5, 100 * level],
      ['boss', 6, 1000]
    ];
  }
  mapGen = () => {
    var openArr = [];
    var maxTurn = 300; // the number of turns the tunnel has
    var maxLength = 10; // maximum number of each turn can have
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

     levels = items;
    // find unique open spots and assign a charcter based on the levels array and the specified level
    var uniq = this.uniqBy(openArr, JSON.stringify);
    for (var i = 0; i < levelPlus6; i++){
      var randNum = Math.floor(Math.random() * uniq.length);
      var randItem = uniq[randNum];
      fulArr[randItem[0]][randItem[1]] = levels[i][1];
      uniq.splice(randNum, 1);
      if (levels[i][1] === 2){
        pLocate = [randItem[0],randItem[1]];
        levels[i][2] = randItem[0];
        levels[i][3] = randItem[1];
      }
      if (levels[i][1] === 4 || levels[i][1] === 5){
        //pLocate = [randItem[0],randItem[1]];
        levels[i].push(randItem[0]);
        levels[i].push(randItem[1]);
      }
    }
    console.log(levels);
    //console.log(this.state.level);
    //console.log("levels " + levels[0][0]);
    //console.log(this.uniqBy(openArr, JSON.stringify));
    return fulArr;// finally retun the array to be drawn
  }
  damage = (level) => {

  }
  centerScreen = () => {
          var tdWidth = document.getElementById('player').clientWidth,
          tdHeight = document.getElementById('player').clientHeight,
          top = window.innerHeight/2 - (pLocate[0]*tdHeight),
          left = window.innerWidth/2 - (pLocate[1]*tdWidth);

      document.getElementById('grid').style.top = top + 'px';
      document.getElementById('grid').style.left = left + 'px';
      console.log("center");
  };
  controllerPress = (e) => { //this is where all the game controls and actions are
    var keyPressed = e.keyCode; //get what button was pushed
    switch (keyPressed) {
      case 37: case 65: /*left arrow or 'a' pressed*/
        this.movePlayer([0, -1]);
        break;
      case 38: case 87: /*up arrow or 'w' pressed*/
        this.movePlayer([-1, 0]);
        break;
      case 39: case 68: /*right arrow or 'd' pressed*/
        this.movePlayer([0, 1]);
        break;
      case 40: case 83: /*down arrow or 's' pressed*/
        this.movePlayer([1, 0]);
        break;
      default:
        break;
    } //end switch
  } //end controllerPress()
  reTile = (move, oldGrid) => {
    oldGrid[items[0][2]][items[0][3]] = 0;
    oldGrid[items[0][2] + move[0]][items[0][3] + move[1]] = 2;
    items[0][2] = items[0][2] + move[0];
    items[0][3] = items[0][3] + move[1];
  }
  movePlayer = (move) => {// move the player according to the current
  if(this.state.grid[items[0][2] + move[0]][items[0][3] + move[1]] === 0){
    var oldGrid = this.state.grid;
    this.reTile(move, oldGrid);
    this.setState ({
      grid: oldGrid
    });
  }else if (this.state.grid[items[0][2] + move[0]][items[0][3] + move[1]] === 3) {
    var oldGrid = this.state.grid;
    this.reTile(move, oldGrid);
    this.setState ({
      health: this.state.health + 100,
      grid: oldGrid
    });
  }else if (this.state.grid[items[0][2] + move[0]][items[0][3] + move[1]] === 4) {
    var oldGrid = this.state.grid;
    this.reTile(move, oldGrid);
    this.setState ({
      weapon: this.state.weapon+ 1,
      grid: oldGrid
    });
  }else if (this.state.grid[items[0][2] + move[0]][items[0][3] + move[1]] === 7) {
    this.setState ({
      grid: this.mapGen()
    });
  }
  else if (this.state.grid[items[0][2] + move[0]][items[0][3] + move[1]] === 5) {
    this.setState ({
      health: this.state.health - 3
    });
  }
  this.centerScreen();
 };



  fullArray = () => {// makes an array filled with 1
    var array = [];
    for (var i = 0; i < hidth; i++) {
      array.push([]);
      for (var j = 0; j < hidth; j++) {
        array[i].push(1);
      }
    }
    return array;
  }
  uniqBy = (a, key) => {// returns a unique array
     var seen = {};
     return a.filter(function(item) {
       var k = key(item);
       return seen.hasOwnProperty(k) ? false : (seen[k] = true);
     })
   }

  render() {
    return (
      <div>
        <table className="grid" id="grid">
          {this.state.grid.map((obj, row) =>
              <tr className="">
                  {obj.map((obj2, col) =>
                    <td
                    id={obj2 === 2 ? 'player' : ""+ row + col}
                    className={obj2 === 1 ? 'wall' :
                                  (obj2 === 2 ? 'player' :
                                  (obj2 === 3 ? 'health' :
                                  (obj2 === 4 ? 'weapon' :
                                  (obj2 === 5 ? 'enemy' :
                                  (obj2 === 6 ? 'boss' :
                                  (obj2 === 7 ? 'stairs' : ""))))))} key={""+ row + col}></td>
              )}</tr>
          )}
        </table>

        <div id="scoreboard">
        <h1>health: {this.state.health} XP: {this.state.xp} level: {this.state.level} weapon: {this.state.weapon}</h1>
        </div>
      </div>
    );
  }
}

export default App;
