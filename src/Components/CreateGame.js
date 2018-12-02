import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class CreateGame extends React.Component{
  constructor(props){
	super(props)
	this.players_per_team = React.createRef()
	this.num_teams = React.createRef()
	this.num_icons = React.createRef()
	this.state = {redirect: false, players_per_team: 1, num_teams: 2, num_icons: 10}
	this.inputs = {
	  players: true,
	  teams: true,
	  icons: true
	}
	this.handleCreateGame = this.handleCreateGame.bind(this)
  }

  handleCreateGame(event){
	console.log(this.inputs)
	//let allTrue = Object.keys(this.inputs).every(function(k){ return this.inputs[k] === true });
	//console.log(allTrue)
	let allTrue = Object.keys(this.inputs).every(k => this.inputs[k]);

	if(!allTrue){
	  document.getElementById("global-error").style.display="block"
	  return
	}
	else{
	  document.getElementById("global-error").style.display="none"
	}
	console.log(allTrue)
	
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
	})
	.then((res) => {
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
	})
	.catch((err) => {
	  console.log(err)
	})
  }


  render(){
	if(this.state.redirect){
	  return (<Redirect to='/lobby'/>)
	}
	else{
	  return(
		<div id="header" className="d-flex align-items-center flex-column justify-content-center h-100 bg-dark text-white">
		  <h1 id="logo" className="display-4">
			Create Game
		  </h1>
		  <div id="global-error" className="alert alert-danger" role="alert" style={{display:"none"}}>
			One or more inputs are bad
		  </div>
          <div className="alert alert-danger" role="alert" id="icons-input-error" style={{visibility:"hidden", verticalAlign:"middle"}}>
                <span id="error-message" className="text-danger" style={{verticalAlign:"middle"}}>
                 
                </span>  
            </div> 
            {/*
            <div className="alert alert-danger" role="alert" id="players-input-error" style={{visibility:"hidden",display:"none", verticalAlign:"middle"}}>
                <span className="text-danger" style={{verticalAlign:"middle"}}>
                The number of players must be greater than 0
                </span>  
            </div>
            <div className="alert alert-danger" role="alert" id="team-input-error" style={{display:"none", verticalAlign:"middle"}}>
                    <span className="text-danger" style={{verticalAlign:"middle"}}>
                    There can only be between 2 and 4 teams
                    </span>  
                </div> 
            */}


          
		  <div className="container">

			<div className="row">
			  <div className="col-md-4">
			  </div>
			  <div className="col-md-4">
				<div className="input-group col-mb-3">
				  <div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Players per team</span>
				  </div>
				  <input ref={this.players_per_team} type='tel' className="form-control" required={true} onChange={ (e) => {
					const numberInput = e.target.value;
					// Only allow numbers for input
					const re = /^[0-9\b]+$/;
					if (numberInput === '' || re.test(numberInput)) {
					  this.setState({ players_per_team: e.target.value });
					}
					if(parseInt(numberInput) <= 0 || numberInput === ''){
                      //document.getElementById("players-input-error").style.display="block"
                      document.getElementById("error-message").style.visibility="visible"
                      document.getElementById("error-message").innerHTML = "The number of players must be greater than 0"
					  console.log(this.inputs.players)
					  this.inputs.players = false
					}
					else {
						
                    document.getElementById("error-message").style.visibility="hidden"
					  this.inputs.players = true
					}}}
					value={ this.state.players_per_team } name='players_per_team'/>
				</div>
				<br/>
				
                </div>
			</div>

			<div className="row">
			  <div className="col-md-4">
			  </div>
			  <div className="col-md-4">
				<div className="input-group mb-3">
				  <div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Number of teams</span>
				  </div>
				  <input ref={this.num_teams} type='tel' className="form-control" required={true} onChange={ (e) => {
					const numberInput = e.target.value;
					// Only allow numbers for input
					const re = /^[0-9\b]+$/;
					if (numberInput === '' || re.test(numberInput)) {
					 this.setState({ num_teams: e.target.value });
					}
					console.log(parseInt(numberInput))
					if(parseInt(numberInput) < 2 || parseInt(numberInput) > 4 || numberInput === ''){
                       //console.log("i am here")
                       document.getElementById("error-message").style.visibility="visible"
                       document.getElementById("error-message").innerHTML = "There can only be between 2 and 4 teams"
                   
					  this.inputs.teams = false
					}
					else{
                        document.getElementById("error-message").style.visibility="hidden"
                    //   document.getElementById("team-input-error").style.display="none"
					  this.inputs.teams = true
					}}}
					value={ this.state.num_teams } name='num_teams'/>
				</div>        
				<br/>

			  </div> 
              
			</div>

			<div className="row">
			  <div className="col-md-4">
			  </div>
			  <div className="col-md-4">
				<div className="input-group mb-3">
				  <div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Number of icons</span>
				  </div>
				  <input ref={this.num_icons} type='tel' className="form-control" required={true} onChange={ (e) => {
					const numberInput = e.target.value;
					// Only allow numbers for input
					const re = /^[0-9\b]+$/;
					if (numberInput === '' || re.test(numberInput)) {
					  this.setState({ num_icons: e.target.value });
					}
					if(numberInput === '' || parseInt(numberInput) < 10 || parseInt(numberInput) > 128){
						//console.log("i am here")
					  document.getElementById("icons-input-error").style.display="block"
					  this.inputs.icons = false
					}
					else{
					  document.getElementById("icons-input-error").style.display="none"
					  this.inputs.icons = true
					}}}
					value={ this.state.num_icons } name='num_icons'/>
				</div>        
				<br/>
			  </div>
              {/*
              <div className="col-md-4" id="icons-input-error" style={{display:"none", verticalAlign:"middle"}}>
                <span className="text-danger" style={{verticalAlign:"middle"}}>
                Number must be between 10 and 128
                </span>  
              </div> 
              */}
			</div>            
		  </div>
		  <button id='create-room' type="button" className="btn btn-success" onClick={this.handleCreateGame}> Enter </button>
		</div>
	  )
	}
  }
}

export default CreateGame