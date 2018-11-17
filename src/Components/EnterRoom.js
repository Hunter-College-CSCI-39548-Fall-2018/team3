<<<<<<< HEAD
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
            credentials: 'include'

        }).then((res) => {
            if(res.ok){
                //parse through response's json object first to get value
                res.json()
                .then((body) =>{
                    //set state (whether or not you should redirect to next page)
                    if(body)
                        this.setState({redirect: true})
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    render(){
        //check if room entered exists or not
        if(this.state.redirect){
            return(
                <Redirect to='/enter-name'/>
            )
        }else{
            return(
                <div>
                    <h1>Enter room to join</h1>

                    <input ref={this.room} type='text' name='room' autoFocus/>
                    <button id='enter-room' type='button' onClick={this.handleEnterRoom}>Enter</button>
                </div>

            )
        }
    }
}

export default EnterRoom
=======
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
            credentials: 'include'

        }).then((res) => {
            if(res.ok){
                //parse through response's json object first to get value
                res.json()
                .then((body) =>{
                    //set state (whether or not you should redirect to next page)
                    if(body)
                        this.setState({redirect: true})
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    render(){
        //check if room entered exists or not
        if(this.state.redirect){
            return(
                <Redirect to='/enter-name'/>
            )
        }else{
            return(
                <div>
                    <h1>Enter room to join</h1>

                    <input ref={this.room} type='text' name='room' autofocus/>
                    <button id='enter-room' type='button' onClick={this.handleEnterRoom}>Enter</button>
                </div>

            )
        }
    }
}

export default EnterRoom
>>>>>>> 5b8997184c3c6b0b7472f6cef2872f76cae518a2
