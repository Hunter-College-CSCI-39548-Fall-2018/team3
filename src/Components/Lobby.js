import React from 'react'
import io from 'socket.io-client'

// const socket = io('localhost:3000')

class Lobby extends React.Component{
    constructor(props){
        super(props)
        this.socket = io('localhost:3000')
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
