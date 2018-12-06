import React from 'react'
import { Redirect } from 'react-router-dom'

class EnterName extends React.Component{ 
    constructor(props){
        super(props)
        this.nickname = React.createRef()
        this.handleEnterName = this.handleEnterName.bind(this)

        this.state = {
            redirct: false,
            message : ""
        }
    }

    handleEnterName(){
        let name = this.nickname.current.value
        let obj = {"nickname":name}

        if(name.length > 12 || name.length < 3){
            //document.getElementById("name-length").style.display="inline";
            this.setState({message : "Nickname needs to be longer than 2 and shorter than 12 character"})
            return;
        }
        
        console.log("this is name", obj)
        let host = 'http://' + location.hostname
        fetch(host+':3000/enter-name', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": 'application/json' },
            credentials: 'include'
        }).then(res => {
            if(res.ok){
                //parse through response's json object first to get value 
                res.json()
                .then((body) =>{
                    console.log('this is the response', body)
                    //set state (whether or not you should redirect to next page)
                    if(body){
                        this.setState({redirect: true})
                        console.log("state of redirect:",this.state.redirect)
                        
                    }
                    else{
                        //document.getElementById("name-taken").style.display="inline";
                        this.setState({message : "Name already taken"})
                        return;
                    }
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    
    render(){
        //when make post request, make sure that user should redirect or not
        //check if name exists in the room or not
        if(this.state.redirect){
            return (<Redirect to='/lobby'/>)
        }else{
            return(

                <div id="header" style={{backgroundColor:"#B4D7B2"}} className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white">
                    <h1 id="logo" className="display-4">
                        Enter your nickname
                    </h1>

                    <div className="container">
                        <div className="row">
                            <div className="col-md-4"></div>

                            <div className="col-md-4">
                                <div className="input-group col-mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Nickname</span>
                                    </div>
                                    <input ref={this.nickname} type='text' name='nickname' className="form-control"  autoFocus/>
                                </div>
                            </div>

                            <div className="col-md-4">
                            </div>
                        </div>
                    </div>
                    <br/>

                    <button id='enter-name' type='button' onClick={this.handleEnterName} className="btn btn-success">Next</button>

                    {/*<div id="global-error" className="alert alert-danger" role="alert" style={{visibility:"hidden"}}>
                        The nickname is taken
                    </div>*/}
                    <div>
                    	{this.state.message}
                    </div>
                </div>
                   

            )
        }
    }
}

export default EnterName
