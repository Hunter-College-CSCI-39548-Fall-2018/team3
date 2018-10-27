import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Main from './Components/Main'
import Home from './Components/Home'
class App extends React.Component {

	render(){
		return(
			<BrowserRouter>
				<div>
					<Route path='/' component={Main} ></Route>

					<Route path='/hi' component={Home} ></Route>
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
