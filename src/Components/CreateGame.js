import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class CreateGame extends React.Component{
    constructor(props){
        super(props)
        this.players_per_team = React.createRef()
        this.numOfteams = React.createRef()
        this.numOfIcons = React.createRef()
        this.state = {redirect: false}

        this.handleCreateGame = this.handleCreateGame.bind(this)

    }

    handleCreateGame(event){
        //get input value from state (reference)
        let players_per_team = this.players_per_team.current.value
        let numOfteams = this.players_per_team.current.value
        let numOfIcons = this.numOfIcons.current.value
        let obj = {"players_per_team":players_per_team, "numOfteams":numOfteams, "numOfIcons":numOfIcons}
        console.log(obj)
        fetch('http://localhost:3000/create-game', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": 'application/json' },
        }).then((res) => {
            if(res.ok){
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
        }).catch((err) => {
            console.log(err)
        })
    }

    render(){
        if(this.state.redirect){
            return (<Redirect to='/lobby'/>)
        }else{
            return(
                <div>

                    <h1> Create Game </h1>

                    <label>players per team</label>
                    <input ref={this.players_per_team} type='text' name='players_per_team'/>
                    <br/>
                    <label>number of teams</label>

                    <input ref={this.numOfteams} type='text' name='numOfteams'/>
                    <br/>
                    <label>number of icons</label>

                    <input ref={this.numOfIcons} type='text' name='numOfIcons'/>
                    <button id='create-room' type='button' onClick={this.handleCreateGame}> Enter </button>
                </div>

            )
        }
    }
}

export default CreateGame
