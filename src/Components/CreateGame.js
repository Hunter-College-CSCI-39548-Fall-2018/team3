import React from 'react'
import { Redirect, Route } from 'react-router-dom'

class CreateGame extends React.Component{
  constructor(props){
    super(props)
    this.time = React.createRef()
	this.num_teams = React.createRef()
	this.state = {redirect: false, num_teams: 2, time: 1}
	this.inputs = {
	  time: true,
	  teams: true,
	}
	this.handleCreateGame = this.handleCreateGame.bind(this)
  }

  handleCreateGame(){
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

    let num_teams = this.num_teams.current.value
    let time = this.time.current.value
    
	let obj = {"num_teams":num_teams, "time": time}
    let host = 'http://' + location.hostname
    
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
					<span className="input-group-text" id="basic-addon1">Game Duration(min)</span>
				  </div>
				  <input ref={this.time} type='tel' className="form-control" required={true} onChange={ (e) => {
					const numberInput = e.target.value;
					// Only allow numbers for input
					const re = /^[0-9\b]+$/;
					if (numberInput === '' || re.test(numberInput)) {
					  this.setState({ time: e.target.value });
					}
					if(parseInt(numberInput) < 0 || numberInput === ''){
                      //document.getElementById("players-input-error").style.display="block"
                      document.getElementById("error-message").style.visibility="visible"
                      document.getElementById("error-message").innerHTML = "The game duration must be greater than 0"
				
					}
					else {
						
                    document.getElementById("error-message").style.visibility="hidden"
					  this.inputs.time = true
					}}}
					value={ this.state.time } name='time'/>
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
					if(parseInt(numberInput) < 2 || parseInt(numberInput) > 3 || numberInput === ''){
                       //console.log("i am here")
                       document.getElementById("error-message").style.visibility="visible"
                       document.getElementById("error-message").innerHTML = "There can only be 2 or 3 teams"
                   
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
		  </div>
		  <button id='create-room' type="button" className="btn btn-success" onClick={this.handleCreateGame}> Enter </button>
		</div>
	  )
	}
  }
}

export default CreateGame