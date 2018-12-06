import React from 'react'
import io from 'socket.io-client'
import Cookies from 'js-cookie';
import Music from './Music';
import GameOwnerControls from './GameOwnerControls'
import {Redirect} from 'react-router-dom'
import PlayerControls from './PlayerControls';
import { timingSafeEqual } from 'crypto';

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            socket: false,
            teams: [],
            connected: true,
            icons: [0, 1, 2, 3],
            team: 0,
            time: false,
            gameWon : false,
            wonTeamInfo : {},
            restart : false,
            GameOwnerRestart : false,
        }
        this.game_owner = Cookies.get('game_owner')
    }

    checkCredentials = () => {
        let cookies = Cookies.get() // returns obj with cookies
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
                    }, () => {
                        
                    })

                    socket.on('invalid-credentials', () => {
                        socket.disconnect()
                        this.clearCookies()
                        this.setState({ connected: false})
                    })

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
        let socket = this.state.socket
        console.log("what is command", command)
        socket.emit('input-command', {command: command, socketid: socket.id})
    }

    handleEvents = () => {
        let socket = this.state.socket

        socket.on('time-left', (time) => {
            this.setState({ time: time})
        })

        socket.on('game-started', (msg) => {
            if(msg.team){
                this.setState({ team: msg.team })
            }
            this.setState({ teams: msg.teams})
        })

        socket.on('new-icons', (icons) => {
            this.setState({ icons: icons })
        })

        socket.on('correct-command', (teams) => {
            let url = './Correct.mp3';
            this.correctAudio = new Audio(url);
            this.correctAudio.play();
            console.log("you got it right");

            //update the team's current icon and score (+)
            this.setState({ teams: teams })
        })

        socket.on('wrong-command', (teams) => {
            //some penalty here
            let url = './Wrong.mp3';
            this.wrongAudio = new Audio(url);
            this.wrongAudio.play();
            //update team's score (-)
            this.setState({ teams: teams})
        })

        socket.on('force-disconnect', () => {
            socket.disconnect()
            this.clearCookies()
            this.setState({ connected: false})
        })

        socket.on('end-game', (wonData) => {
        	this.setState({gameWon : true, 'wonTeamInfo' : wonData})
        })

        socket.on('restart', () => {
        	this.clearCookies()
            this.setState({restart : true})
        })

        socket.on('GameOwnerRestart', () => {
        	this.clearCookies()
            this.setState({GameOwnerRestart : true})
        })

    }

	handleRestart = () => {
		let socket = this.state.socket
		socket.emit('restart')
	}

    componentWillUnmount = () => {
        // if(this.state.socket){
        //     this.state.socket.close()
        //     this.state.socket.disconnect()       
        // }
    }

    render() {
        if(!this.state.connected){
            console.log("client disocnnected bescause of what");
            this.clearCookies()
            return (<Redirect to='/'/>)
        }

		if (this.state.restart === true){
			return (
				<Redirect to='/enter-room' />
			)
		}

		if (this.state.GameOwnerRestart === true){
			return (
				<Redirect to='/create-game' />
			)			
		}

        if (this.state.gameWon === true){
			const teamWon = this.state.wonTeamInfo['teamNumber']
			const wonScore = this.state.wonTeamInfo['score']
			const playersWon = this.state.wonTeamInfo['players'].map((player,index) => {
				var playerName = player['name']	
				return (
					<li key={index}>
						{playerName}
					</li>
				)
			})
        	return (
	 			<div>
					<h1> Congratulations Team {teamWon} Won </h1>
					<br/>
					Score: {wonScore}  
					<br/>
					Players:
					<br/>
					<ul>
						{playersWon}
					</ul>
					<br/>
					<button onClick={this.handleRestart}> Restart </button>
					<Music url = {'./Winning-Screen.wav'} />
					<Music url = {'./Firework.mp3'} />
				</div>       		
        	)
        }
        else{
            return (
                <div style={{height:"100%"}}>
                    {
                    this.game_owner == "1" ? 
                    (
                        <div>
                            <GameOwnerControls
                                teams={this.state.teams}
                                time= {this.state.time}
                            /> 
                            <Music url = {'./Game.wav'}/>
                        </div>
                    )
                    : <PlayerControls
                        icons={this.state.icons}
                        handleCommand={this.handleCommand}
                        team={this.state.team}/>
                    }
                </div>
            )
        }
    }
}

export default Game