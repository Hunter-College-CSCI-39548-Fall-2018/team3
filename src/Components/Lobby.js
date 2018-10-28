import React from 'react'
import io from 'socket.io-client';

//const socket = io('http://localhost:3000/');

class Lobby extends React.Component{
    constructor(props){
        super(props)
        this.io = io.connect('http://localhost:3000/', {
          transports: ['websocket'],
          upgrade: false,
        });

    }

    componentDidMount(){
      const socket = io.connect('http://localhost:3000/', {
        transports: ['websocket'],
        upgrade: false,
      });
    }

    LobbyRoom(event){
    }

    render(){
        return(
          <div>
            <div id='code'>code: </div>
            <div id='players'>players: </div>
          </div>
        )
    }
}

export default Lobby
