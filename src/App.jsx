import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './Components/Home'
import EnterRoom from './Components/EnterRoom'
import EnterName from './Components/EnterName'
import Lobby from './Components/Lobby'
import CreateGame from './Components/CreateGame'

class App extends React.Component {
// express has precedence over react-
// if a route defined in express has same name in react, will go to express route

	
	render(){
		return(
			<BrowserRouter>
				<Switch>
					<Route path='/enter-room' component={EnterRoom}></Route>
					<Route path='/' exact component={Home}></Route>
					<Route path='/enter-name' component={EnterName}></Route>
					<Route exact path='/lobby' component={Lobby}></Route>
					<Route path='/create-game' component={CreateGame}></Route>
					<Route path='/game' component={Game}></Route>
				</Switch>
			</BrowserRouter>
		)
	}
}

ReactDOM.render((<App />), document.getElementById('root'));

module.hot.accept();
