import React from 'react'
import { Redirect } from 'react-router-dom'

class EnterName extends React.Component{
    constructor(props){
        super(props)
        this.nickname = React.createRef()
        this.redirect = React.createRef()
        this.handleEnterName = this.handleEnterName.bind(this)
    }

    handleEnterName(event){

        let name = this.nickname.current.value
        let obj = {"nickname":name}

        console.log("this is name", obj)

        fetch('http://localhost:3000/enter-name', {
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
                <h1>Enter your nickname</h1>

                <input ref={this.nickname} type='text' name='nickname'/>
                <button id='enter-name' type='button' onClick={this.handleEnterName}>Next</button>
            </div>

        )
    }
}

export default EnterName
