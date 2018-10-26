import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './Components/Home'
class App extends React.Component {

	render(){
		return(
			<BrowserRouter>
				<Route path='/hi' component={Home} ></Route>
			</BrowserRouter>
		)
	}
}
ReactDOM.render(
	(
		<App />

), document.getElementById('root'));

module.hot.accept();
