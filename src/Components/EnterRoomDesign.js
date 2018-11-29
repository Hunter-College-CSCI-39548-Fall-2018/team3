import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class EnterRoomDesign extends React.Component{
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
        let host = 'http://' + location.hostname
        fetch(host+':3000/enter-room', {
            
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": 'application/json' },
            credentials: 'include'

        }).then((res) => {
            
            if(res.ok){
                //parse through response's json object first to get value
                res.json()
                .then((body) =>{
                    console.log(body)
                    
                    //set state (whether or not you should redirect to next page)
                    console.log(body)
                    if (body['gameStart'] === true){
                        document.getElementById("room-error").innerHTML = "Game already started"
                    }
                    else if (body['keyValid'] === true){
                        this.setState({redirect: true})
                    }
                    else{
                        document.getElementById("room-error").innerHTML = "Invalid Key"
                    }
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
                <div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white">
                    <h1 id="logo" className="display-4">
                        Enter your nickname for the game
                    </h1>
                    <div id="global-error" className="alert alert-danger" role="alert" style={{display:"none"}}>
                        One or more inputs are bad
                    </div>
                    <div className="container">
                    </div>

                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Players per team</span>
                            </div>
                            <input ref={this.players_per_team} type='tel' className="form-control" placeholder="Your nickname (3-12 characters)" required={true} />

                        </div>
                    </div>
                </div>

            )
        }
    }
}

export default EnterRoomDesign
