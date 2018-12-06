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
            // console.log('received new player')
            console.log("check for bugged player", curr_users)
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
        if(this.state.socket){
            //destroy socket instance
            this.state.socket.close()
            this.state.socket.disconnect()
        }
    }

    render() {
        if(this.socket.disconnected){
            console.log("hey wait you dsiconencted");
        }

        //start of game
        if(this.state.start_game){
            return (<Redirect to='/game'/>)
        }

        //force redirect
        if(!this.state.connected/* || this.socket.disconnected*/){
            console.log("disocinected because of something");
            return (<Redirect to='/'/>)
        }

        if (this.state.connected) {
            return (
                <div style={{backgroundColor:"#c9c9ff"}} id="header" className="d-flex align-items-center flex-column justify-content-center h-100">
                    <h1 id="logo" style={{fontFamily: "Open Sans"}}className="display-4">
                        {this.state.code}
                    </h1>

                    <a href="/create-game">Create Game</a>
                    <br />
                    <a href="/enter-room">Enter Room</a>

                    <div id="countdown-timer">Time until start: {this.state.timeRem}</div>
                    <br />
                    
                    
                    <div className="card">
                        <div className="card-header font-weight-bold" style={{ fontSize: "16px" }}>
                            Players
                        </div>
                        <div class="card-body">
                        <div id='players'>
                            
                            {Object.keys(this.state.players).map((player, i) =>
                                <span style={{ fontSize: "16px" }} className="ml-3 badge badge-secondary" key={i}>

                                    <span className="tag label label-info">
                                        {console.log("player data", player)}
                                        <span>{player}</span>
                                        {
                                            this.game_owner == '1' ? 
                                            <a onClick={this.handleKick.bind(this, player)} ><i className="far fa-times-circle"></i></a> 
                                            : ""
                                        }
                                        
                                    </span>
                                </span>
                            
                            )}
                            </div>
                        </div>
                    </div>
                
                    <div>
                        {this.state.teams.map((team,index)=>
                            <span key={index}><span style={{float: "left", fontSize:"16px"}}>Team {index+1}</span>
                                
                                <ul style={{float:"left", marginLeft:"10px"}} class="list-group">
                                {team.players.map((player,i) =>
                                     <li className="list-group-item" style={{display:"listItem"}} key={i}> {player.name} </li>
                                )}
                                </ul>
                            
                            </span>
                        )}
                    </div>

                    <br />
                    {
                        this.game_owner == '1' ? 
                            <button onClick={this.startTimer} type="button" className="btn btn-success">Start Timer</button> 
                        : ""
                    }
                </div>    
            )
        }     
    }
}
export default Lobby