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
// if
	render(){
		return(
			<BrowserRouter>
				<Switch>
					<Route path='/enter-room' component={EnterRoom}></Route>
					<Route path='/' component={Home}></Route>
					<Route path='/enter-name' component={EnterName}></Route>
					<Route path='/lobby' component={Lobby}></Route>
					<Route path='/create-game' component={CreateGame}></Route>
				</Switch>
			</BrowserRouter>
		)
	}
}

ReactDOM.render((<App />), document.getElementById('root'));

module.hot.accept();