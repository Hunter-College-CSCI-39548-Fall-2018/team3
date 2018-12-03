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
            this.setState({ disconnect: true})
        })
    }

    startGame = () => {
        let socket = this.state.socket
        socket.emit('start-game')
    }

    componentWillUnmount = () => {
        this.state.socket.close()
        this.state.scoket.disconnect()

        if(!this.state.disconnect){
            this.clearCookies()
        }
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