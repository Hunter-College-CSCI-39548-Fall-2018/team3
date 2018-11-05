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
        socket.emit('input-command', command)
    }

    //in the event of wrong or right command, do something
    handleEvents = () => {
        let socket = this.state.socket
        console.log("Socket is", socket)

        socket.on('start-game', (seq) => {
            this.setState({sequence: seq})
        })

        socket.on('correct-command', (seq) => {
            this.setState({sequence: seq})
        })

        socket.on('wrong-command', (seq) => {
            //some penalty here
            console.log("you suck")
        })
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
                <div>{this.state.turn}</div>
            </div>

        )
    }
}

export default Game