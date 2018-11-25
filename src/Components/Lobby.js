import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom'

class Lobby extends React.Component{
    constructor(props){

      super(props)
      this.state = {
        players: "",
        teams: [],
        code: "",
        socket: false,
        timeRem: 3,
        connected: true,
        start_game: false
      }
      this.game_owner = Cookies.get("game_owner")
      console.log(this.game_owner);

    }
    componentDidMount(){
        let code = Cookies.get("room");
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
      let socket = this.state.socket
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

    handleEvents = () => {
        
        let socket = this.state.socket

        socket.on('get-curr-users', (curr_users) => {
            this.setCurrUsers(curr_users)
        })

        socket.on('new-player', (name) => {
          let player = ""
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
        
          //debugger;
        //   console.log(this.state.teams)
        
          // for(let i = 0; i < data.length(); i++){
          //   for(let i = 0; i < data[i].length(); i++){
          //
          //   }
          // }
          
        //   console.log("You are in Team", this.state.teams.findIndex(x => x == Cookies.get("player")));
          //debugger;

          // Display the list of all players by team name
          document.getElementById("team-name").style.display="block";

          
        })

        // Only execute the shuffleTeams command when the timer is at 0
        socket.on('time-left', (time) => {
          this.setState({timeRem: time});
          if(time === 0){
              console.log(time)
              this.shuffleTeams()
          }
        });

    }

    startTimer = ()=>{
      let socket = this.state.socket
      //console.log("I am in start timer")
      // console.log("The socket is", this.socket)

      // Tell the server to start the countdown timer for this room
      socket.emit("start-time", {room:this.state.code});
    }


    startGame = () => {

        // When the room owner is ready to start the game then
        // the new state is set for the redirect
        this.setState({start_game: true})
    }


    render(){
        if(this.state.start_game){
            return(<Redirect to='/game'/>)
        }

        if(this.state.connected){
            return(
                <div>
                    <div id="team-name" style={{display:"none"}}>You are in Team {this.state.teams.findIndex(x => x == Cookies.get("player"))}</div>
                    <div id='code'>code: <input type="text" defaultValue={this.state.code} autoFocus/></div>
        
                    <div id='players'>players: {this.state.players}</div>
                    <div id='timeDisplay'>Time Until Start: {this.state.timeRem} </div>
                    {this.game_owner == '1' ? <button onClick={this.startTimer}>Start Timer</button> : ""}

                    <div id="teams" style={{margin:"0 auto", textAlign:"center"}}>
                        {this.state.teams.map((team,index) => 
                        <div key={index}><span style={{float: "left"}}>Team {index+1}</span>
                        <ul style={{float:"left", width:"20%", display: "inline-block"}}key={index}>
                            {team.map((player,i) => <li key={i}> {player} </li>)}  
                        </ul>
                        </div>
                        )}
                    </div>
                </div>
            )
        }
        else{
            //if game owner disconnected, disconnect all players in lobby and redirect
            return(<Redirect to='/'/>)
        }
        
    }

}

export default Lobby