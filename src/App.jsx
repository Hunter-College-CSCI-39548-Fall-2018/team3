import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './Components/Home'
class App extends React.Component {
// express has precedence over react- 
// if 
	render(){
		return(
			<BrowserRouter>
				<Switch>
					<Route path='/hi' component={Home}></Route>
					<Route path='/p' component={Home}></Route>
					
					<Route path= '/test' component={Home}></Route>
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
