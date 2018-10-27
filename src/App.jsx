import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Main from './Components/Main'
import Home from './Components/Home'
import Home from './Components/EnterName'
class App extends React.Component {

	render(){
		return(
			<BrowserRouter>
				<div>
					<Route path='/' component={Main} ></Route>

					<Route path='/hi' component={Home} ></Route>

					<Route path='/enter-name' component={EnterName} ></Route>
				</div>

			</BrowserRouter>
		)
	}
}
ReactDOM.render(
	(
		<App />

), document.getElementById('root'));

module.hot.accept();
