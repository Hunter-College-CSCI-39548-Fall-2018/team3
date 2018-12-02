import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom'

class Lobby extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      players: [],
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
    // console.log(this.game_owner);
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
    //   console.log("res status is", res.status)
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
    
    // console.log("I am in shuffleTeams")
  }

  setCurrUsers = (curr_users) => {
    // let players = ""
    // console.log('attempting to add current users')
    console.log("set curr arr",curr_users)
    // for(let key in curr_users){
    //     console.log("set curr key",key)
    //   players += (" " + <span className="badge badge-secondary">{key}</span>)
    // }

    this.setState({players: curr_users})
    console.log("state of players in setCurrUsers:", this.state.players)
    //debugger
  }
    
  getTeamNum = () => {
    let index = 0;
    // console.log("im in teamnum")

    // console.log(this.state.teams.length)
    for (var i = 0, len = this.state.teams.length; i < len; i++) {
        for (var j = 0, len2 = this.state.teams[i].length; j < len2; j++) {
            // console.log(this.state.teams[i][j], Cookies.get("player"))
            if (this.state.teams[i][j].name === Cookies.get("player")) {
                // console.log("i have a match at", i, j)


                this.setState({
                    teamNum: i + 1
                })
              }
          }
      }
  }


  handleEvents = () => {      
    const socket = this.state.socket

    socket.on('get-curr-users', (curr_users) => {
        console.log("get-curr-users",curr_users)
        this.setState({players: curr_users})
        //this.setCurrUsers(curr_users)
    })

    socket.on('new-player', (curr_users) => {
       console.log('received new player', curr_users)
       this.setState({players: curr_users})
    })

    socket.on('player-disconnected', (curr_users) => {
        // console.log("player disocnnected");
        this.setCurrUsers(curr_users)
    })

    socket.on("shuffled-teams", (data) => {
    //   console.log(data)
      // Updating the current state of teams after the shuffle
      
        this.setState({teams: data.team})
        console.log("these are the teams:", this.state.teams)
        this.getTeamNum()

        // Display the list of all players by team name
        // document.getElementById("team-name").style.display="block";
    })

    
    // Only execute the shuffleTeams command when the timer is at 0
    socket.on('time-left', (time) => {
      this.setState({timeRem: time});
      
      if(time === 0){
        // console.log("time is this value: ", time)
        this.shuffleTeams()
        //document.getElementById("kick-player").style.display = "none"
      }
    });

    socket.on('updatePlayers', (roomObject) => {
      console.log("Current Room object", roomObject)
      let curr_users = ""
      for (let key in roomObject){
        // curr_users += (" " + <span style={{fontSize: "16px"}} className="badge badge-secondary">{key}</span>)
      }
      this.setState({players : curr_users})
    })

    socket.on('redirect-user',(socketid) => {
    //   console.log("Redirect this user:",socketid)
    //   console.log("Curr user:",this.state.socket['id'])
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

    if(this.state.redirect === true){
      return(<Redirect to='/'/>)
    }

    if(this.state.start_game){
      return(<Redirect to='/game'/>)
    }

    if(this.state.connected){
      return(
        <div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white">
            <h1 id="logo" className="display-4">
            {this.state.code}
            </h1>
        
            <a href="/create-game">Create Game</a>
            <br/>
            <a href="/enter-room">Enter Room</a>

            <div id="countdown-timer">Time until start: {this.state.timeRem}</div>
            <br />
                <div id='players' style={{fontSize: "16px"}} className="font-weight-bold">
                    {/* Players: {this.state.players.map((player,i)=> <span style={{fontSize: "16px"}} className="ml-3 badge badge-secondary" key={i}>{player}</span>)} */}
                    Players: 
                    {Object.keys(this.state.players).map((player,i)=>
                        <span style={{fontSize: "16px"}} className="ml-3 badge badge-secondary" key={i}>
                            
                            <span className="tag label label-info">
                               <span>{player}</span>
                                <a onClick={this.handleKick.bind(this,player)} ><i className="far fa-times-circle"></i></a> 
                            </span>
                        </span>
                    )}
                    <div>
                    {this.state.teams.map((team,index)=>
                        <div key={index}><span style={{float: "left"}}>Team {index+1}</span>
                            
                                <ul style={{float:"left", width:"20%", display: "inline-block"}} key={index}>
                                {team.map((player,i) => <li style={{display:"listItem"}} key={i}> {player.name} </li>)}  
                                </ul>
                        
                        </div>

                
                    )}
                    </div>
                    <div className="panel panel-default">
                        <header className="panel-heading">
                            <h5 className="panel-title"></h5>
                        </header>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                             
                            
                            </div>     
                    </div>

                </div>
                    <footer className="panel-footer">...</footer>
            </div>
            <br />
    
            <div id="teams" style={{margin:"0 auto", textAlign:"center"}}>
            {Object.keys(this.state.teams).map((team,i)=>
                (
                    <span key={i}>{
                        Object.keys(team).map((player,j)=>
                            <div key={j}>{player.name}</div>
                        )
                    }</span>
                ))
            }
                {/* {this.state.teams.map((team,index) => 
                {
                <div key={index}><span style={{float: "left"}}>Team {index+1}</span>
                    <ul style={{float:"left", width:"20%", display: "inline-block"}} key={index}>
                    {team.map((player,i) => <li key={i}> {player.name} </li>)}  
                    </ul>
                </div>
            
                }
                )} */}

            </div>
            {this.game_owner == '1' ? <button onClick={this.startTimer} type="button" className="btn btn-success">Start Timer</button> : ""}

        </div>
      )
    }
    else{
        // if anyone disconnected, redirect all players including game owner to home
        return(
          <Redirect to='/'/>
        )
    } 
  }

}

export default Lobby