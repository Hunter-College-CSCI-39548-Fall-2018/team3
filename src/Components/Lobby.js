import React from 'react'
import io from 'socket.io-client';
import SockObject from './game'

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
        upgrade: false,
      });
      console.log("on first render?")

      
      var sock = new SockObject(socket)

      //listen for players joining and append them to a div
      sock.listenForUsers(this.state.players)

  
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
