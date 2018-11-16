const _ = require('underscore')

class Room{
  constructor(){
    this.settings = {}
    this.players = {}
    this.key = ""
    this.teams = []
  }

  setSettings(settings){
    this.settings = settings
  }

  setKey(key){
    this.key = key
  }

  setTeam(teams){
    this.teams = teams
  }

  setPlayers(players){
    this.players = players
  }

  addPlayer(player, value){
    // this.players.push(player)
    this.players[player] = value
    // console.log("player in room?",this.players.hasOwnProperty(player))

  }
  splitUp(arr, n) {
    var rest = arr.length % n, // how much to divide

        restUsed = rest, // to keep track of the division over the elements
        partLength = Math.floor(arr.length / n),
        result = [];
        console.log("rest ", rest);
    for(var i = 0; i < arr.length; i += partLength) {
        var end = partLength + i,
            add = false;

        if(rest !== 0 && restUsed) { // should add one element for the division
            end++;
            restUsed--; // we've used one division element now
            add = true;
        }

        result.push(arr.slice(i, end)); // part of the array

        if(add) {
            i++; // also increment i in the case we added an extra element for division
        }
    }
    console.log(result)
    return result;
}
  hasPlayer(player){
    console.log(this.players)
    return this.players.hasOwnProperty(player)
  }

  createTeams(){
    //let teams = this.settings.numOfTeams;
    let teams = 4;
    let templateTeam = [];
    for(let i = 0; i < teams; i++){
      //this.teams.push(templateTeam);
    }
  }


  shuffleTeams(){
    //chunk is playes per team
    var i,j,temparray,chunk = 4;
    var i,j,temparray,chunk = 4;
    let newArr = _.shuffle(this.players);

    this.teams = _.chunk(newArr, 4);

    console.log("shuffled teams ", this.teams);
    //console.log("isArray: ", Array.isArray(this.players));
    //console.log("player array", this.players);
    //this.splitUp(this.players, chunk)
    //this.shuffleArray(this.players)
    //console.log("players length", this.players.length);
    // for(let name in this.players){
    //   temparray = this.players.slice(i,i+chunk);
    //   console.log(temparray);
    //   this.teams.push(temparray);
    // }
    /*
    for (i=0,j=this.players.length(); i<j; i+=chunk) {

        // do whatever
    }
    */

  }

  returnTeams(){
    return this.teams
  }
}

module.exports = Room
