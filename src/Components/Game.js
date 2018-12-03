import React from 'react'
import io from 'socket.io-client'
import Cookies from 'js-cookie';
import GameOwnerControls from './GameOwnerControls'
import {Redirect} from 'react-router-dom'
import PlayerControls from './PlayerControls';
import Lobby from './Lobby'

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            socket: false,
            teams: [],
            connected: true,
            icons: [0, 1, 2, 3],
            team: 0
        }
        this.game_owner = Cookies.get('game_owner')
        this.socket = false
    }

    checkCredentials = () => {
        let cookies = Cookies.get() // returns obj with cookies
        console.log("cookies obj", cookies);
        console.log("is room in cokie", "room" in cookies);
        return "room" in cookies
    }

    componentDidMount() {
        if(!this.checkCredentials()){
            console.log("there s aproblem with the credentials");
            this.setState({ connected: false })
        }else{ 
            let host = 'http://' + location.hostname
            fetch(host + ':3000/game', {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => {
                if(res.ok){
                    console.log("response!", res.status)
                    const socket = io.connect(host + ':3000/', {
                        transports: ['websocket'],
                        upgrade: false,
                        'force new connection': true
                    })

                    this.socket = socket
                    //fetch is asynchronous, so have the client connect after the request is made
                    this.setState({
                        socket: socket
                    }, () => {
                        this.handleEvents()
                        console.log("state is", this.state.socket)
                    })
                }
            })
            .catch(err => console.log("error", err))
        }
    }

    clearCookies = () =>{
        Cookies.remove("room")
        Cookies.remove("player")
        Cookies.remove("game_owner")
    }
    //get input command from player
    handleCommand = (command) => {
        console.log("called handlecomamnd");
        let socket = this.state.socket
        socket.emit('input-command', {command: command, socketid: socket.id})
    }

    handleEvents = () => {
        let socket = this.state.socket
        console.log("Socket is", socket)

        socket.on('game-started', (teams) => {
            this.setState({ teams: teams})
        })

        socket.on('correct-command', (teams) => {
            console.log("you got ir ghti");

            //update the team's current icon and score (+)
            this.setState({ teams: teams })
        })

        socket.on('wrong-command', (teams) => {
            //some penalty here
            console.log("you suck")

            //update team's score (-)
            this.setState({ teams: teams})
        })

        socket.on('force-disconnect', () => {
            this.clearCookies()
            this.setState({ connected: false})
        })
    }

    startGame = () => {
        let socket = this.state.socket
        socket.emit('start-game')
    }

    componentWillUnmount = () => {
        // if(this.state.socket){
        //     this.state.socket.close()
        //     this.state.socket.disconnect()
        // }
    }

    render() {
        if(!this.state.connected/* || this.socket.disconnected*/){
            console.log("client disocnnected bescause of what");
            // this.clearCookies()
            return (<Redirect to='/'/>)
        }
        
        return (
            <div style={{height:"100%"}}>
                {console.log("i am in game.js return",this.state.teams)}
                {
                this.game_owner === "1" ? 
                <GameOwnerControls
                    teams={this.state.teams}
                    startGame={this.startGame}
                /> 
                : <PlayerControls
                    icons={this.state.icons}
                    handleCommand={this.handleCommand}
                    team={this.state.team}
                />
                }   
            </div>
        )
    }
}

export default Game