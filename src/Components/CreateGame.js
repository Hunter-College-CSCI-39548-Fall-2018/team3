import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class CreateGame extends React.Component{
    constructor(props){
        super(props)
        this.players_per_team = React.createRef()
        this.num_teams = React.createRef()
        this.num_icons = React.createRef()
        this.state = {redirect: false, players_per_team: 1, num_teams: 2, num_icons: 10}

        this.handleCreateGame = this.handleCreateGame.bind(this)

    }

    handleCreateGame(event){
        //get input value from state (reference)
        let players_per_team = this.players_per_team.current.value
        let num_teams = this.num_teams.current.value
        let num_icons = this.num_icons.current.value
        let obj = {"players_per_team":players_per_team, "num_teams":num_teams, "num_icons":num_icons}
        //console.log(obj)
        console.log(this.props.location)
        let host = 'http://' + location.hostname
        //console.log(host+':3000/create-game')
        fetch(host+':3000/create-game', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": 'application/json' },
            credentials: 'include'
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
                    <input ref={this.players_per_team} type='tel' required={true} onChange={ (e) => {
     const numberInput = e.target.value;
     // Only allow numbers for input
     const re = /^[0-9\b]+$/;
     if (numberInput === '' || re.test(numberInput)) {
       this.setState({ players_per_team: e.target.value });
     }
   }}
   value={ this.state.players_per_team } name='players_per_team'/>
                    <br/>
                    <div id="players-input-error" style={{display:"none"}}>Number must be greater than 0</div>
                    <label>number of teams</label>

                    <input ref={this.num_teams}  type='tel' required={true} onChange={ (e) => {
     const numberInput = e.target.value;
     // Only allow numbers for input
     const re = /^[0-9\b]+$/;
     if (numberInput === '' || re.test(numberInput)) {
       this.setState({ num_teams: e.target.value });
     }
     console.log(parseInt(numberInput))
     if(parseInt(numberInput) < 2 || parseInt(numberInput) > 4){
         //console.log("i am here")
        document.getElementById("team-input-error").style.display="block"
     }
         
     
     else{
        document.getElementById("team-input-error").style.display="none"
     }
        
   }}
   value={ this.state.num_teams } name='num_teams'/>
                    
                    <br/>
                    <div id="team-input-error" style={{display:"none"}}>Number must be between 2 and 4</div>
                    <label>number of icons</label>

                    <input ref={this.num_icons} type='tel' required={true} onChange={ (e) => {
     const numberInput = e.target.value;
     // Only allow numbers for input
     const re = /^[0-9\b]+$/;
     if (numberInput === '' || re.test(numberInput)) {
       this.setState({ num_icons: e.target.value });
     }
   }}
   value={ this.state.num_icons } name='num_icons'/>
                    <div id="icons-input-error" style={{display:"none"}}>Number must be between 10 and 128</div>
                    <button id='create-room' type='button' onClick={this.handleCreateGame}> Enter </button>
                </div>

            )
        }
    }
}

export default CreateGame
