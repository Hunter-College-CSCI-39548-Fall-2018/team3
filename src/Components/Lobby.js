import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom'

class Lobby extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        players: "",
        teams: [],
        code: "",
        socket: false,
        timeRem: 3,
        connected: true,
        start_game: false,
        teamNum: 0,
        redirect: false
      }
      this.game_owner = Cookies.get("game_owner")
      console.log(this.game_owner);
    }

    componentDidMount(){
      const code = Cookies.get("room");
      this.setState({code:code});
      let host = 'http://' + location.hostname
      fetch(host+':3000/lobby', {
        method: 'GET',
        credentials: 'include'
      })
      .then((res) => {
        console.log("res status is", res.status)
        const socket = io.connect(host+':3000', {
            transports: ['websocket'],
            upgrade: false
        })

        //everything is asynchronous, so need to set socket state and then do all stuff after using callback
        this.setState({socket:socket}, () => {
            this.handleEvents()
        })
      })
      .catch((err) =>console.log(err))
    }

    shuffleTeams = () => {
      const socket = this.state.socket
      if(Cookies.get("game_owner") === '1'){
        socket.emit("shuffle-teams")
      }
      
      console.log("I am in shuffleTeams")
    }

    setCurrUsers = (curr_users) => {
      let players = ""
      console.log('attempting to add current users')

      for(let key in curr_users){
          players += (" " + key)
      }

      this.setState({players: players})
    }

    getTeamNum = () => {
      let index = 0;

      console.log("im in teamnum")
      console.log(this.state.teams.length)

      for (var i=0, len=this.state.teams.length; i<len; i++) {
        for (var j=0, len2=this.state.teams[i].length; j<len2; j++) {
            console.log(this.state.teams[i][j], Cookies.get("player"))
          if (this.state.teams[i][j].name === Cookies.get("player")) { 
              console.log("i have a match at", i, j)
              this.setState({teamNum: i+1})
          }
        }
      }

    }


    handleEvents = () => {      
        const socket = this.state.socket

        socket.on('get-curr-users', (curr_users) => {
            this.setCurrUsers(curr_users)
        })

        socket.on('new-player', (name) => {
          console.log('received new player')
          this.setState({players: this.state.players + " " + name})
        })

        socket.on('player-disconnected', (curr_users) => {
            console.log("player disocnnected");
            this.setCurrUsers(curr_users)
        })
 
        socket.on("shuffled-teams", (data) => {
          console.log(data)
          // Updating the current state of teams after the shuffle
          
          this.setState({teams: data.team})
            this.getTeamNum()

          // Display the list of all players by team name
          document.getElementById("team-name").style.display="block";
        })

        
        // Only execute the shuffleTeams command when the timer is at 0
        socket.on('time-left', (time) => {
          this.setState({timeRem: time});
          
          if(time === 0){
            console.log("time is this value: ", time)
            this.shuffleTeams()
            document.getElementById("kick-player").style.display = "none"
          }
        });

        socket.on('updatePlayers', (roomObject) => {
          console.log("Current Room object", roomObject)
          let curr_users = ""
          for (let key in roomObject){
            curr_users += (" " + key)
          }
          this.setState({players : curr_users})
        })

        socket.on('redirect-user',(socketid) => {
          console.log("Redirect this user:",socketid)
          console.log("Curr user:",this.state.socket['id'])
          if (socket['id'] === socketid){
            this.setState({redirect:true})
          }
        })   

    }

    startTimer = ()=>{
      const socket = this.state.socket

      // Tell the server to start the countdown timer for this room
      socket.emit("start-time", {room:this.state.code});
    }


    startGame = () => {
      // When the room owner is ready to start the game then the new state is set for the redirect
      this.setState({start_game: true})
    }

    handleKick = (kickPlayer) => {
      console.log( "Kick Player Name: ", kickPlayer)
      let socket = this.state.socket
      socket.emit('kick', kickPlayer)
      
    }
      
    render(){

        const kickPlayer = this.state.players.split(" ").slice(1).map((player,index) => {
          return (<div key={index}>
            <button key={index} onClick={this.handleKick.bind(this,player)}> 
              {player}
            </button>
            </div>
          )
        })

        if(this.state.redirect === true){
          return(<Redirect to='/'/>)
        }

        if(this.state.start_game){
          return(<Redirect to='/game'/>)
        }

        if(this.state.connected){
            return(
                <div>
                  <div id="team-name" style={{display:"none"}}>
                    You are in Team {this.state.teamNum}
                  </div>

                  <div id='code'>code: <input type="text" defaultValue={this.state.code} autoFocus/>
                  </div>
      
                  <div id='players'>
                    players: {this.state.players}
                  </div>

                  <div id='timeDisplay'>
                    Time Until Start: {this.state.timeRem}
                  </div>

                  {this.game_owner == '1' ? <button onClick={this.startTimer}>Start Timer</button> : ""}

                  <div id="kick-player">
                    {(this.game_owner == '1' ? kickPlayer : "")}
                  </div>

                  <div id="teams" style={{margin:"0 auto", textAlign:"center"}}>
                    {this.state.teams.map((team,index) => {
                      <div key={index}><span style={{float: "left"}}>Team {index+1}</span>
                        <ul style={{float:"left", width:"20%", display: "inline-block"}}key={index}>
                          {team.map((player,i) => <li key={i}> {player.name} </li>)}  
                        </ul>
                      </div>
                    })}
                  </div>

                  <a href="/create-game">Create Game</a>
                  <br/>
                  <a href="/enter-room">Enter Room</a>
                </div>
            )
        }
        else{
            // if game owner disconnected, disconnect all players in lobby and redirect
            return(<Redirect to='/'/>)
        }
        
    }

}

export default Lobby