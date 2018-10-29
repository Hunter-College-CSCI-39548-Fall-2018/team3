import React from 'react'
import io from 'socket.io-client';

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
