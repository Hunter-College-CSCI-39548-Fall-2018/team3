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
            disconnect: false
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
        console.log(socket)
        // if (this.state.turn) {
        //     console.log("inputing omcmadn");
        //     socket.emit('input-command', { command: command, socketid: socket.id })
        // } else {
        //     console.log("not your turn fool");
        // }
    }

    handleEvents = () => {
        let socket = this.state.socket
        console.log("Socket is", socket)

        socket.on('game-started', (data) => {
            console.log("received curr_icon after start game", data.icon);
            this.setState({ curr_icon: data.icon })
            this.setState({ teams: data.teams})
        })

        socket.on('correct-command', (icon) => {
            this.setState({ curr_icon: icon })
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

        const player_controls = (
            <div>
                {/* replace this with images from cdn eventually */}
                <button id='A' onClick={this.handleCommand.bind(this, 'A')}>A</button>
                <button id='B' onClick={this.handleCommand.bind(this, 'B')}>B</button>
                <button id='C' onClick={this.handleCommand.bind(this, 'C')}>C</button>
                <button id='D' onClick={this.handleCommand.bind(this, 'D')}>D</button>
            </div>
        )
        
        return (
            <div>
                {
                    this.game_owner === "1" ? 
                    <GameOwnerControls
                        teams = {this.state.teams}
                        handleShuffle={this.handleShuffle}
                        startGame={this.startGame}
                        curr-icon = {this.state.curr_icon} 

                    /> 
                    : <PlayerControls
                        icons={[1, 2, 3]}
                        handleCommand = {this.handleCommand}
                        team={1}
                    />
                }   
            </div>
        )
    }
}

export default Game