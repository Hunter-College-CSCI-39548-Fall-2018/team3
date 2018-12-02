import React from 'react'
import io from 'socket.io-client'
import Cookies from 'js-cookie';
import GameOwnerControls from './GameOwnerControls'
import {Redirect} from 'react-router-dom'
import PlayerControls from './PlayerControls';

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            socket: false,
            curr_icon: "",
            teams: [],
            disconnect: false,
            icons: [0, 1, 2, 3],
            team: 0
        }
        this.game_owner = Cookies.get('game_owner')
    }

    componentDidMount() {
        let host = 'http://' + location.hostname
        fetch(host + ':3000/game', {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                console.log("response!", res.status)
                const socket = io.connect(host + ':3000/', {
                    transports: ['websocket'],
                    upgrade: false,
                    'force new connection': true
                })

                //fetch is asynchronous, so have the client connect after the request is made
                this.setState({
                    socket: socket
                }, () => {
                    this.handleEvents()
                    console.log("state is", this.state.socket)
                })

            })
            .catch(err => console.log("error", err))
    }

    //get input command from player
    handleCommand = (command) => {
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

            //update the team's current icon
            this.setState({ teams: teams })
        })

        socket.on('wrong-command', () => {
            //some penalty here
            console.log("you suck")
        })

        socket.on('force-disconnect', () => {
            this.setState({ disconnect: true})
        })

        socket.on('clear-cookies', () => {
            Cookies.remove("room")
            Cookies.remove("player")
            Cookies.remove("game_owner")
        })
    }

    handleShuffle = () => {
        let socket = this.state.socket
        socket.emit('shuffle')
    }

    startGame = () => {
        let socket = this.state.socket
        socket.emit('start-game')
    }

    render() {
        if(this.state.disconnect){
            return (<Redirect to='/'/>)
        }
        
        return (
            <div>
                {
                this.game_owner === "1" ? 
                <GameOwnerControls
                    teams = {this.state.teams}
                    handleShuffle={this.handleShuffle}
                    startGame={this.startGame}
                /> 
                : <PlayerControls
                    icons={this.state.icons}
                    handleCommand = {this.handleCommand}
                    team={this.state.team}
                />
                }   
            </div>
        )
    }
}

export default Game