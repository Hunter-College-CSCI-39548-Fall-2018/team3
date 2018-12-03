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
            redirect: false
        }
        this.game_owner = Cookies.get("game_owner")
        // console.log(this.game_owner);
    }

    componentDidMount() {
        const code = Cookies.get("room");
        this.setState({ code: code });
        let host = 'http://' + location.hostname
        fetch(host + ':3000/lobby', {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                //   console.log("res status is", res.status)
                const socket = io.connect(host + ':3000', {
                    transports: ['websocket'],
                    upgrade: false
                })

                //everything is asynchronous, so need to set socket state and then do all stuff after using callback
                this.setState({ socket: socket }, () => {
                    this.handleEvents()
                })
            })
            .catch((err) => console.log(err))
    }

    shuffleTeams = () => {
        const socket = this.state.socket
        if (Cookies.get("game_owner") === '1') {
            socket.emit("shuffle-teams")
        }

        // console.log("I am in shuffleTeams")
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
            this.clearCookies()
            this.setState({connected: false})
        })

        socket.on("shuffled-teams", (team) => {
            console.log("this is teams", team);
            // Updating the current state of teams after the shuffle
            this.setState({ teams: team }, () => {
                console.log("this is teams", team);
                // this.getTeamNum()
            })
        })

        // Only execute the shuffleTeams command when the timer is at 0
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
        const socket = this.state.socket

        socket.emit('shuffle-teams')    

        // Tell the server to start the countdown timer for this room
        socket.emit("start-time", {room:this.state.code});
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
        //destroy socket instance
        let socket= this.state.socket
        socket.close()
        socket.disconnect()

        if(!this.state.start_game){
            this.clearCookies()
        }
    }

    render() {
        if(this.state.start_game){
            return (<Redirect to='/game'/>)
        }

        if (this.state.redirect === true) {
            return (<Redirect to='/' />)
        }

        if (this.state.connected) {
            return (
                <div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white">
                    <h1 id="logo" className="display-4">
                        {this.state.code}
                    </h1>

                    <a href="/create-game">Create Game</a>
                    <br />
                    <a href="/enter-room">Enter Room</a>

                    <div id="countdown-timer">Time until start: {this.state.timeRem}</div>
                    <br />
                    <div id='players' style={{ fontSize: "16px" }} className="font-weight-bold">
                        {/* Players: {this.state.players.map((player,i)=> <span style={{fontSize: "16px"}} className="ml-3 badge badge-secondary" key={i}>{player}</span>)} */}
                        Players:
                        {Object.keys(this.state.players).map((player, i) =>
                            <span style={{ fontSize: "16px" }} className="ml-3 badge badge-secondary" key={i}>

                                <span className="tag label label-info">
                                    <span>{player}</span>
                                    <a onClick={this.handleKick.bind(this, player)} ><i className="far fa-times-circle"></i></a>
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
                </div>    
            )      
        }
        else {
            // if anyone disconnected, redirect all players including game owner to home
            return (
                <Redirect to='/' />
            )
        }
    }
}
export default Lobby