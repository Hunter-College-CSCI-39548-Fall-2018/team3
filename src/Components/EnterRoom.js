import React from 'react'
import { Redirect } from 'react-router-dom'

class EnterRoom extends React.Component{
    constructor(props){
        super(props)
        this.room = React.createRef()
        this.redirect = React.createRef()
        this.handleEnterRoom = this.handleEnterRoom.bind(this)
    }
    
    handleEnterRoom(event){
        let room = this.room.current.value
        let obj = {"room":room}
        console.log("this is room", obj)
        fetch('http://localhost:3000/enter-room', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": 'application/json' },
        }).then(redirect => {
            if(redirect){
                
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render(){
        return(
            <div>
                <h1>Enter room to join</h1>

                <input ref={this.room} type='text' name='room'/>
                <button id='enter-room' type='button' onClick={this.handleEnterRoom}>Enter</button>
            </div>
           
        )
    }
}

export default EnterRoom