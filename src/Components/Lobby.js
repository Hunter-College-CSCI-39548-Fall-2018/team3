import React from 'react'
import io from 'socket.io-client'

let socket = io(`http://localhost:3000`)

class Lobby extends React.Component{
    constructor(props){
        super(props)
        //this.room = React.createRef()
        //this.redirect = React.createRef()
        //this.handleLobby = this.handleLobby.bind(this)
    }

    handleLobby(event){
        /*
        let room = this.room.current.value
        let obj = {"room":room}
        console.log("this is room", obj)
        */
    }

    render(){
        return(
          <div>
            <div id='code'>code: d</div>
            <div id='players'>players: </div>
          </div>
        )
    }
}

export default Lobby
