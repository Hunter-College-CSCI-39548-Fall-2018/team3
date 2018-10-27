import React from 'react'
import io from 'socket.io-client'

let socket = io(`http://localhost:3000`)

class Lobby extends React.Component{
    constructor(props){
        super(props)
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
