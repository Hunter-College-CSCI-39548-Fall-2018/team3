import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class EnterRoom extends React.Component{
    constructor(props){
        super(props)
        this.room = React.createRef()
        this.handleEnterRoom = this.handleEnterRoom.bind(this)

        this.state = {redirect: false}
    }
    
    handleEnterRoom(event){
        //get input value from state (reference)
        let room = this.room.current.value
        let obj = {"room":room}

        fetch('http://localhost:3000/enter-room', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": 'application/json' },
        }).then((redirect) => {

            //set state (whether or not you should redirect to next page)
            if(redirect){
                this.setState({redirect: true})
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    render(){
        return(
            <div>
                {/* if redirect state true then redirect otherwise render original page */}
                <Route path='/enter-name' render={() => {
                   this.state.redirect ? (<Redirect to='/enter-name'/>) : (<EnterRoom/>)
                }}/>
                
                <h1>Enter room to join</h1>
                
                <input ref={this.room} type='text' name='room'/>
                <button id='enter-room' type='button' onClick={this.handleEnterRoom}>Enter</button>
            </div>
           
        )
    }
}

export default EnterRoom