import React from 'react'
import io from 'socket.io-client';
class Lobby extends React.Component{
    constructor(props){
      super(props)

      this.state = {players: ""}
    }

    componentDidMount(){
      fetch('http://localhost:3000/lobby', {
        method: 'GET',
        credentials: 'include'
      }).catch((err) => {
        console.log(err)
      })

      const socket = io.connect('http://localhost:3000/', {
        transports: ['websocket'],
        upgrade: false
      })
      console.log("on first render?")

      socket.on('get-curr-users', (curr_users) => {
        let players = ""
        console.log('attempting to add current users')

        for(let key of curr_users){
          players += (" " + key)
        }

        this.setState({players: players})
      })

      socket.on('new-player', (name) => {
        let player = ""
        console.log('received new player')
        player += (" " + name)

        this.setState({players: this.state.players + player})
      })
      // var sock = new SockObject(socket)

      // //listen for players joining and append them to a div
    }

    render(){
      return(
        <div>
          <div id='code'>code: </div>
          <div id='players'>players: {this.state.players}</div>
        </div>
      )
    }
}

export default Lobby
