import React from 'react'
import io from 'socket.io-client'

class Game extends React.Component{
    constructor(props){
        super(props)
        this.state = {socket: false, sequence: "", turn: false}
    }

    componentDidMount(){
        fetch('http://localhost:3000/game', {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => {
            console.log("response!", res.status)
            const socket = io.connect('http://localhost:3000/', {
                transports: ['websocket'],
                upgrade: false
            })

            //fetch is asynchronous, so have the client connect after the get request is made
            this.setState({
                socket: socket
            },()=>{
                this.handleEvents()
                console.log("state is", this.state)
            })

        })
        .catch(err => console.log("error", err))

        
    }

    //get input command from player
    handleCommand = (command) => {
        let socket = this.state.socket
        console.log(command)
        if(this.state.turn){
            socket.emit('input-command', command)
        }else{
            console.log("not your turn fool");
        }
    }

    //in the event of wrong or right command, do something
    handleEvents = () => {
        let socket = this.state.socket
        console.log("Socket is", socket)

        socket.on('your-turn', () =>{
            this.setState({turn: true})
        })

        socket.on('start-game', (seq) => {
            this.setState({sequence: seq})
        })

        socket.on('correct-command', (seq) => {
            console.log("is seqeuecne yes got it")

            this.setState({sequence: seq})
            this.setState({turn: false})
        })

        socket.on('wrong-command', () => {
            this.setState({turn: true})

            //some penalty here
            console.log("you suck")
        })
    }

    handleShuffle = () => {
        let socket = this.state.socket
        socket.emit('shuffle-teams')
    }

    startGame = () => {
        let socket = this.state.socket
        socket.emit('start-game')
    }
    render() {
        return(
            <div>
                {/* replace this with images from cdn eventually */}
                <button id='A' onClick={this.handleCommand.bind(this,'A')}>A</button>
                <button id='B' onClick={this.handleCommand.bind(this,'B')}>B</button>
                <button id='C' onClick={this.handleCommand.bind(this,'C')}>C</button>
                <button id='D' onClick={this.handleCommand.bind(this,'D')}>D</button>


                <div>{this.state.sequence}</div>
                <div>is your turn? {(this.state.turn).toString()}</div>

                <button onClick={this.handleShuffle.bind(this)}>test shuffle</button>
                <button onClick={this.startGame.bind(this)}>start game</button>
            </div>

        )
    }
}

export default Game