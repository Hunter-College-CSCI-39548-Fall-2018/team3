import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class CreateGame extends React.Component{
    constructor(props){
        super(props)
        this.players_per_team = React.createRef()
        this.numOfteams = React.createRef()
        this.numOfIcons = React.createRef()
        this.handleCreateGame = this.handleCreateGame.bind(this)
        this.state = {redirect: false}
    }

    handleCreateGame(event){
        //get input value from state (reference)
        let players_per_team = this.players_per_team.current.value
        let numOfteams = this.players_per_team.current.value
        let numOfIcons = this.numOfIcons.current.value
        let obj = {"players_per_team":players_per_team, "numOfteams":numOfteams, "numOfIcons":numOfIcons}
        console.log(obj)
        fetch('http://localhost:3000/create-room', {
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
                <Route path='/' render={() => {
                   this.state.redirect ? (<Redirect to='/'/>) : (<CreateGame/>)
                }}/>
                
                <h1> Create Game </h1>

                <input ref={this.players_per_team} type='text' name='players_per_team'/>
                <input ref={this.numOfteams} type='text' name='numOfteams'/>
                <input ref={this.numOfIcons} type='text' name='numOfIcons'/>
                <button id='create-room' type='button' onClick={this.handleCreateRoom}> Enter </button>
            </div>
           
        )
    }
}