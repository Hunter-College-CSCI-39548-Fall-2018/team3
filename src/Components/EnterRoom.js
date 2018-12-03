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
                <div id="header" style={{backgroundColor:"#ffbdbd"}} className="d-flex align-items-center flex-column justify-content-center h-100">
                    <h1 id="logo" className="display-4">
                        Room Code
                    </h1>
                    <div id="global-error" className="alert alert-danger" role="alert" style={{visibility:"hidden"}}>
                        The room does not exist
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4"></div>

                            <div className="col-md-4">
                                <div className="input-group col-mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Code:</span>
                                    </div>
                                    <input ref={this.room} type='text' name='room' className="form-control"  autoFocus/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <button id='enter-code' type='button' onClick={this.handleEnterRoom} className="btn btn-success">Next</button>

                </div>
                

            )
        }
    }
}

export default EnterRoom
