import React from 'react'
import io from 'socket.io-client';

<<<<<<< HEAD
//const socket = io('http://localhost:3000/');
=======
>>>>>>> 4a23c09adfd05d763a98b40ffff13fab46674699

class Lobby extends React.Component{
    constructor(props){
        super(props)
<<<<<<< HEAD
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
=======
        this.socket = io('localhost:3000')
>>>>>>> 4a23c09adfd05d763a98b40ffff13fab46674699
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
