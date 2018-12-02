import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import Music from './Music.js';
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

    //use this function when you want to update all users on the page after an event
    updateUsers = (curr_users) => {
        let players = ""
        console.log('attempting to add current users')

        for(let key in curr_users){
            players += (" " + key)
        }

        this.setState({players: players})
    }

    // Why doesn't this run?
    getTeamNum = () => {        
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
        let socket = this.state.socket

        socket.on('get-curr-users', (curr_users) => {
            this.updateUsers(curr_users)
        })

        socket.on('new-player', (name) => {
            console.log('received new player')
            this.setState({players: this.state.players + " " + name})
        })

        socket.on('player-disconnected', (curr_users) => {
            console.log("player disocnnected");
            this.updateUsers(curr_users)
        })
        
        socket.on('force-disconnect', () => {
            this.setState({connected: false})
        })

        socket.on("shuffled-teams", (team) => {
            // Updating the current state of teams after the shuffle
            this.setState({ teams: team }, () =>{
                console.log("this is teams", team);
                // this.getTeamNum()
            })
        })

        // Only execute the shuffleTeams command when the timer is at 0
        socket.on('time-left', (time) => {
          this.setState({timeRem: time});
          
          if(time === 0){
                console.log("time is this value: ", time)  
                this.startGame()              
            }
        });

        socket.on('clearCookie', () => {
        	Cookies.remove('game_owner')
        	Cookies.remove('room')
        	Cookies.remove('player')
        })
    }
    
    startTimer = ()=>{
        const socket = this.state.socket

        socket.emit('shuffle-teams')    
        document.getElementById("kick-player").style.display = "none"

        // Tell the server to start the countdown timer for this room
        socket.emit("start-time", {room:this.state.code});
    }

    startGame = () => {
        // When the room owner is ready to start the game then the new state is set for the redirect
        this.setState({start_game: true})
    }

    handleKick = (player) => {
        let socket = this.state.socket
        socket.emit('kick', player)
    }
    
    componentWillUnmount = () => {
        //destroy socket instance
        let socket= this.state.socket
        socket.close()
    }

    render(){
        const kickPlayer = this.state.players.split(" ").slice(1).map((player,index) => {
            return (
                <div key={index}>
                    <button key={index} onClick={this.handleKick.bind(this, player)}> 
                        {player}
                    </button>
                </div>
            )
        })

        if(this.state.start_game){
            return(<Redirect to='/game'/>)
        }

        if(this.state.connected){
            return(
                <div>
                    {/* <Music/> */}
                    {this.game_owner=== '1'? <Music/>: ""}
                    <div id="team-name" style={{display:"none"}}>
                        You are in Team {this.state.teamNum}
                    </div>

                    <div id='code'>code: <input type="text" defaultValue={this.state.code} autoFocus/></div>

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
                        {this.state.teams.map((team,index) => 
                            <div key={index}><span style={{float: "left"}}>Team {index+1}</span>
                                <ul style={{float:"left", width:"20%", display: "inline-block"}}key={index}>
                                    {team.players.map((player,i) => <li key={i}> {player.name} </li>)}  
                                </ul>
                            </div>
                        )}
                    </div>

                    <a href="/create-game">Create Game</a>
                    <br/>
                    <a href="/enter-room">Enter Room</a>
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