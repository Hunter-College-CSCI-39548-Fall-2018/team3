import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Main from './Components/Main'
import Home from './Components/Home'
import EnterRoom from './Components/EnterRoom'
import EnterName from './Components/EnterName'
import Lobby from './Components/Lobby'
class App extends React.Component {
// express has precedence over react-
// if
	render(){
		return(
			<BrowserRouter>
				<Switch>
					<Route path='/enterRoom' component={EnterRoom}></Route>
					<Route path='/p' component={Home}></Route>
					<Route path= '/enterName' component={EnterName}></Route>
					<Route path= '/lobby' component={Lobby}></Route>
				</Switch>

			</BrowserRouter>
		)
	}
}
ReactDOM.render(
	(
		<App />

), document.getElementById('root'));

module.hot.accept();
