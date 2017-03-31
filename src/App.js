
import React, { Component } from 'react';
import './App.css';


var levels = [];//a copy of the items on the board and their locations

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor : 6,//how far should the map loop through the items array
      hidth : 30,// height and width
      playing: true,//player/win/lose/playing state
      health: 50,
      xp: 0,
      weapon: 1,
      level:1,
      message:"Use the arrow keys to move around.",
      grid:[]// the main map diplayed on the screen
    };
  }
  componentWillMount () {
    {
      this.setState({grid:this.mapGen()})// make a map based on the states and set it to grid
    }
  }
  componentDidMount () {//set the player to center and listen for keypress
  this.centerScreen();
  document.addEventListener('keydown', this.controllerPress.bind(this));
  }
  componentDidUpdate() {//listen for death or win
   this.centerScreen();
     if(this.state.playing === false){
       this.timer = setInterval(this.deathCheck, 50);
     }else if(this.state.playing === "won")
     {this.timer = setInterval(this.winCheck, 50);}
 }
 items = (level) =>{// the main items array that the cursor will go through based on the level
   return [
     ['player', 2,1000,1000],
     ['health', 3],
     ['stairs', 7],
     ['weapon', 4],
     ['enemy', 5,1000,1000,Math.floor(100+100*.3*level)],
     ['enemy', 5,1000,1000,Math.floor(100+100*.3*level)],
     ['health', 3],
     ['weapon', 4],
     ['health', 3],
     ['enemy', 5,1000,1000,Math.floor(100+100*.3*level)],
     ['boss', 6,0,0,1000]
   ];
 }
 mapGen = () => {
   var openArr = [];
   var maxTurn = 300; // the number of turns the tunnel has
   var maxLength = 5; // maximum number of each turn can have
   var fulArr = this.fullArray(); // save a full array;
   var curRow = Math.floor(Math.random() * this.state.hidth);// pick a random row
   var curCol = Math.floor(Math.random() * this.state.hidth);// pick a random column
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
            curRow === this.state.hidth - 1 && randTurn[0] === 1 ||
            curCol === this.state.hidth - 1 && randTurn[1] === 1){
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
   // make an array of items and give enemies blood based on their level
    levels = this.items(this.state.level);
   // find unique open spots and assign a charcter based on the levels array and the specified level
   var uniq = this.uniqBy(openArr, JSON.stringify);
   // loop through empty spots and allocate items
   for (var j = 0; j < this.state.cursor; j++){
     var randNum = Math.floor(Math.random() * uniq.length);
     var randItem = uniq[randNum];
     fulArr[randItem[0]][randItem[1]] = levels[j][1];
     uniq.splice(randNum, 1);
     if (levels[j][1] === 2){
       levels[j][2] = randItem[0];
       levels[j][3] = randItem[1];
     }
     if (levels[j][1] === 4 || levels[j][1] === 5){
       levels[j][2] = randItem[0];
       levels[j][3] = randItem[1];
     }
   }

   return fulArr;// finally retun the array to be drawn
 }
  deathCheck = () => {// if dead
    alert("you are dead, would you like to restart?");
    this.restart();
    clearInterval(this.timer);
  }
  winCheck = () => {// if won
    alert("you won, would you like to restart?");
    this.restart();
    clearInterval(this.timer);
  }
  restart = () => {//restart
    location.reload();
  }
  centerScreen = () => {// centerscreen based on player location
      var tdWidth = document.getElementById('player').clientWidth,
      tdHeight = document.getElementById('player').clientHeight,
      top = window.innerHeight/2 - (levels[0][2]*tdHeight),
      left = window.innerWidth/2 - (levels[0][3]*tdWidth);
      document.getElementById('grid').style.top = top + 'px';
      document.getElementById('grid').style.left = left + 'px';
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
  reTile = (move, oldGrid) => {//change the tiles after each move
    oldGrid[levels[0][2]][levels[0][3]] = 0;
    oldGrid[levels[0][2] + move[0]][levels[0][3] + move[1]] = 2;
    levels[0][2] +=  move[0];
    levels[0][3] +=  move[1];
  }
  movePlayer = (move) => {// move the player according to the current
  var oldGrid;
  if(this.state.grid[levels[0][2] + move[0]][levels[0][3] + move[1]] === 0){//if empty spot
    oldGrid = this.state.grid;
    this.reTile(move, oldGrid);
    this.setState ({
      grid: oldGrid,
      message: "collect items and fight enemies"
    });
  }else if (this.state.grid[levels[0][2] + move[0]][levels[0][3] + move[1]] === 3) {//if health
    oldGrid = this.state.grid;
    this.reTile(move, oldGrid);
    this.setState ({
      health: this.state.health + 100,
      grid: oldGrid,
      message: "Health item collected."
    });
  }else if (this.state.grid[levels[0][2] + move[0]][levels[0][3] + move[1]] === 4) {//if weapon
    oldGrid = this.state.grid;
    this.reTile(move, oldGrid);
    this.setState ({
      weapon: this.state.weapon+ 1,
      grid: oldGrid,
      message: "Weapon effectiveness upgraded."
    });
  }else if (this.state.grid[levels[0][2] + move[0]][levels[0][3] + move[1]] === 7) {// if teleport
    this.setState ({
      grid: this.mapGen(),
      message: "Teleported to another section of the dungeon."
    });
  }
  else if (this.state.grid[levels[0][2] + move[0]][levels[0][3] + move[1]] === 5) {//enemy
    var playerDamage = Math.floor( 30 * (1 + this.state.weapon / 3)+Math.random() * 4);//set player damage
    var enemyDamage = Math.floor(30 * this.state.level+Math.random() * 4);//set enemy damage
    var targetEnem = 1000;
    levels.map((arr, j) => {// findout which enemy is being fought with
     if(arr[0] === "enemy" &&
         arr[2] === levels[0][2] + move[0] &&
         arr[3] === levels[0][3] + move[1]){
         targetEnem = j;
      }
    });
    if(this.state.health <= enemyDamage){//detect death
      console.log("dying");
      console.log("enemy health: " + levels[targetEnem][4]);
      console.log("player Damag: " + playerDamage);
      console.log("player healt: " + this.state.health);
      console.log("enemy damage: " + enemyDamage);
      this.setState ({
        playing: false,
        health: this.state.health - enemyDamage,
        message: "YOU ARE DEAD !!!"
      });

    }else if(levels[targetEnem][4] > playerDamage){//detect fighting
      console.log("fighting");
      console.log("enemy health: " + levels[targetEnem][4]);
      console.log("player Damag: " + playerDamage);
      console.log("player healt: " + this.state.health);
      console.log("enemy damage: " + enemyDamage);
      levels[targetEnem][4] -= playerDamage;
      this.setState ({
        health: this.state.health - enemyDamage,
        message: "enemy health:" + levels[targetEnem][4] + ", enemy hit power: " + enemyDamage
      });
    }else if(levels[targetEnem][4] <= playerDamage){//detect enemy kill
      console.log("enemy kill");
      console.log("enemy health: " + levels[targetEnem][4]);
      console.log("player Damag: " + playerDamage);
      console.log("player healt: " + this.state.health);
      console.log("enemy damage: " + enemyDamage);
      levels[targetEnem][4] = 0;
      oldGrid = this.state.grid;
      this.reTile(move, oldGrid);
      var curLevel = this.state.level;
      var curCursor = this.state.cursor;
      if(this.state.xp % 5 === 0 && this.state.cursor < 11){
        curLevel = this.state.level + 1;
        curCursor = this.state.cursor + 1;
      }
      this.setState ({
        health: this.state.health - enemyDamage,
        xp: this.state.xp + 1,
        grid: oldGrid,
        level: curLevel,
        cursor: curCursor,
        message: "Enemy Destroyed!"
      });
    }
  }else if (this.state.grid[levels[0][2] + move[0]][levels[0][3] + move[1]] === 6) {// detect boss and do the same as enemy
    var playerDamage = Math.floor( 30 * (1 + this.state.weapon / 3)+Math.random() * 4);
    var enemyDamage = Math.floor(100 * this.state.level+Math.random() * 4);
    var targetEnem = 10;
    if(this.state.health <= enemyDamage){
      console.log("dying");
      console.log("enemy health: " + levels[targetEnem][4]);
      console.log("player Damag: " + playerDamage);
      console.log("player healt: " + this.state.health);
      console.log("enemy damage: " + enemyDamage);
      this.setState ({
        playing: "won",
        health: this.state.health - enemyDamage,
        message: "YOU WIN !!!"
      });
    }else if(levels[targetEnem][4] > playerDamage){
      console.log("fighting");
      console.log("enemy health: " + levels[targetEnem][4]);
      console.log("player Damag: " + playerDamage);
      console.log("player healt: " + this.state.health);
      console.log("enemy damage: " + enemyDamage);
      levels[targetEnem][4] -= playerDamage;
      this.setState ({
        health: this.state.health - enemyDamage,
        message: "Boss health:" + levels[targetEnem][4] + ", Boss hit power: " + enemyDamage
      });
    }else if(levels[targetEnem][4] <= playerDamage){
      console.log("enemy kill");
      console.log("enemy health: " + levels[targetEnem][4]);
      console.log("player Damag: " + playerDamage);
      console.log("player healt: " + this.state.health);
      console.log("enemy damage: " + enemyDamage);
      levels[targetEnem][4] = 0;
      oldGrid = this.state.grid;
      this.reTile(move, oldGrid);
      this.setState ({
        health: this.state.health - enemyDamage,
        xp: this.state.xp + 1,
        grid: oldGrid,
        message: "YOU WIN!"
      });
      alert("YOU WIN");
      this.restart();
    }

  }

 };

  fullArray = () => {// makes an array filled with 1
    var array = [];
    for (var i = 0; i < this.state.hidth; i++) {
      array.push([]);
      for (var j = 0; j < this.state.hidth; j++) {
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
              <tr className="" key={row}>
                  {obj.map((obj2, col) =>
                    <td
                    id={obj2 === 2 ? 'player' : ""+ row + col}
                    className={obj2 === 1 ? 'wall' :
                                  (obj2 === 2 ? 'player' :
                                  (obj2 === 3 ? 'health' :
                                  (obj2 === 4 ? 'weapon' :
                                  (obj2 === 5 ? 'enemy' :
                                  (obj2 === 6 ? 'boss' :
                                  (obj2 === 7 ? 'stairs' : ""))))))} key={col}></td>
              )}</tr>
          )}
        </table>


        <div id="scoreboard">
          <h1>health: {this.state.health} XP: {this.state.xp} level: {this.state.level} weapon: {this.state.weapon}</h1>
          <h1 id = "message" >{this.state.message}</h1>
          <h2 className = {"player"}>{"player"}</h2><h2 className = {"health"}>{"health"}</h2><h2 className = {"weapon"}>{"weapon"}</h2>
          <h2 className = {"enemy"}>{"enemy"}</h2><h2 className = {"boss"}>{"boss"}</h2><h2 className = {"stairs"}>{"teleport"}</h2>
        </div>
      </div>
    );
  }
}

export default App;
