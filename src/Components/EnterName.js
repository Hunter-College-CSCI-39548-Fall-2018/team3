import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class EnterName extends React.Component{
    constructor(props){
        super(props)
        this.nickname = React.createRef()
        this.handleEnterName = this.handleEnterName.bind(this)

        this.state = {redirct: false}
    }

    handleEnterName(event){

        let name = this.nickname.current.value
        let obj = {"nickname":name}

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
                <div>
                    <h1>Enter your nickname</h1>

                    <input ref={this.nickname} type='text' name='nickname' autoFocus/>
                    <button id='enter-name' type='button' onClick={this.handleEnterName}>Next</button>
                </div>

            )
        }
    }
}

export default EnterName
