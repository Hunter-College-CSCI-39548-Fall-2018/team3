import React from 'react'
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom'

class Lobby extends React.Component {

    constructor(props) {
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
            message : ""
        }
        this.game_owner = Cookies.get("game_owner")
        this.socket = false
    }

    checkCredentials = () => {
        let cookies = Cookies.get() // returns obj with cookies
        console.log("cookies obj", cookies);
        console.log("is room in cokie", "room" in cookies);
        return "room" in cookies
    }

    componentDidMount() {
        //find way to find state of disconnect of socket after it has been instantiated 

        if(!this.checkCredentials()){
            this.setState({ connected: false})
        }else{
            const code = Cookies.get("room");
            this.setState({ code: code });
            let host = 'http://' + location.hostname

            fetch(host + ':3000/lobby', {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => {
                if(res.ok){
                    //   console.log("res status is", res.status)
                    const socket = io.connect(host + ':3000', {
                        transports: ['websocket'],
                        upgrade: false,
                        'force new connection': true
                    }, () => {
                        this.socket = socket
                    })


                    console.log("this is socket", socket);
                    //everything is asynchronous, so need to set socket state and then do all stuff after using callback
                    this.setState({ socket: socket }, () => {
                        this.handleEvents()
                    })
                }
            })
            .catch((err) => console.log(err))
        }
    }

    clearCookies = () => {
        Cookies.remove('game_owner')
        Cookies.remove('room')
        Cookies.remove('player')
    }

    handleEvents = () => {
        let socket = this.state.socket

        socket.on('get-curr-users', (curr_users) => {
            this.updateUsers(curr_users)
        })

        socket.on('new-player', (curr_users) => {
            console.log('received new player')
            this.setState({players: curr_users})
        })

        socket.on('player-disconnected', (curr_users) => {
            console.log("player disocnnected");
            this.updateUsers(curr_users)
        })

        socket.on('force-disconnect', () => {
            this.setState({ connected: false})
            this.clearCookies()
        })
 
        socket.on("shuffled-teams", (teams) => {
            console.log("this is teams", teams);
            // Updating the current state of teams after the shuffle
            this.setState({ teams: teams })
        })

        socket.on('time-left', (time) => {
            this.setState({ timeRem: time });

            if (time === 0) {
                console.log("time is this value: ", time)
                this.startGame()
            }
        });
    }

    //use this function when you want to update all users on the page after an event
    updateUsers = (curr_users) => {
        this.setState({ players: curr_users })
    }

    startTimer = () => {
    	if (Object.keys(this.state.players).length > 0) {
	        const socket = this.state.socket

	        socket.emit('shuffle-teams')    

	        // Tell the server to start the countdown timer for this room
	        socket.emit("start-time", {room:this.state.code});
	    }
	    else{
	    	this.setState({message : "No players are currently in the lobby"})
	    }
    }

    startGame = () => {
        // When the room owner is ready to start the game then the new state is set for the redirect
        this.setState({ start_game: true })
    }

    handleKick = (kickPlayer) => {
        console.log("Kick Player Name: ", kickPlayer)
        let socket = this.state.socket
        socket.emit('kick', kickPlayer)
    }

    componentWillUnmount = () => {
        console.log("unmounted");
        if(!this.state.start_game){
            console.log("didsconnect correctly on componet unmount");
            this.clearCookies()
        }
    }

    render() {
        //start of game
        if(this.state.start_game){
            return (<Redirect to='/game'/>)
        }

        //force redirect
        if(!this.state.connected || (this.socket.disconnected && !this.state.start_game) ){
            console.log("disocinected because of something");
            this.clearCookies()
            return (<Redirect to='/'/>)
        }
        
        return (
            <div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white">
                <h1 id="logo" className="display-4">
                    {this.state.code}
                </h1>

                <div id="countdown-timer">Time until start: {this.state.timeRem}</div>
                <br />
                <div id='players' style={{ fontSize: "16px" }} className="font-weight-bold">
                    {/* Players: {this.state.players.map((player,i)=> <span style={{fontSize: "16px"}} className="ml-3 badge badge-secondary" key={i}>{player}</span>)} */}
                    Players:
                    {Object.keys(this.state.players).map((player, i) =>
                        <span style={{ fontSize: "16px" }} className="ml-3 badge badge-secondary" key={i}>

                            <span className="tag label label-info">
                                <span>{player}</span>
                                {
                                    this.game_owner == '1' ? 
                                    <a onClick={this.handleKick.bind(this, player)} ><i className="far fa-times-circle"></i></a> 
                                    : ""
                                }
                            </span>
                        </span>
                    )}
                    <div className="panel panel-default">
                        <header className="panel-heading">
                            <h5 className="panel-title"></h5>
                        </header>
                    </div>
                    <footer className="panel-footer">...</footer>
                </div>
            
                <div>
                    {this.state.teams.map((team,index)=>
                        <div key={index}><span style={{float: "left"}}>Team {index+1}</span>
                            
                            <ul style={{float:"left", width:"20%", display: "inline-block"}} key={index}>
                                {team.players.map((player,i) => <li style={{display:"listItem"}} key={i}> {player.name} </li>)}  
                            </ul>
                        
                        </div>
                    )}
                </div>

                <br />
                <footer className="panel-footer">...</footer>
                {
                    this.game_owner == '1' ? 
                        <button onClick={this.startTimer} type="button" className="btn btn-success">Start Timer</button> 
                    : ""
                }

                {	this.state.message != "" ?
                		this.state.message
                	: ""
            	}                
            </div>    
        )      
    }
}
export default Lobby