import React from 'react'
import io from 'socket.io-client';
class Lobby extends React.Component{
    constructor(props){
      super(props)
      this.socket = null;
      this.state = {players: ""}
    }

    componentDidMount(){
      fetch('http://localhost:3000/lobby', {
        method: 'GET',
        credentials: 'include'
      }).catch((err) => {
        console.log(err)
      })

      this.socket = io.connect('http://localhost:3000/', {
        transports: ['websocket'],
        upgrade: false
      })
      console.log("on first render?")

      this.socket.on('get-curr-users', (curr_users) => {
        let players = ""
        console.log('attempting to add current users')

        for(let key of curr_users){
          players += (" " + key)
        }

        this.setState({players: players})
      })

      this.socket.on('new-player', (name) => {
        let player = ""
        console.log('received new player')
        player += (" " + name)

        this.setState({players: this.state.players + player})
      })
      // var sock = new SockObject(socket)

      // //listen for players joining and append them to a div
    }

    startTimer = ()=>{
      // console.log("The socket is", this.socket)
      this.socket.emit("startTime")
    }

    // this.socket.on("startedTime")

    render(){
      return(
        <div>
          <div id='code'>code: </div>
          <div id='players'>players: {this.state.players}</div>
          <button onClick = {this.startTimer}>Start Timer</button>
        </div>
      )
    }
}

export default Lobby
