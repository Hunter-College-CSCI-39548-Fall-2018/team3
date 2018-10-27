import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Main from './Components/Main'
import Home from './Components/Home'
class App extends React.Component {
// express has precedence over react- 
// if 
	render(){
		return(
			<BrowserRouter>
<<<<<<< HEAD
				<Switch>
					<Route path='/hi' component={Home}></Route>
					<Route path='/p' component={Home}></Route>
					
					<Route path= '/test' component={Home}></Route>
				</Switch>
				
=======
				<div>
					<Route path='/' component={Main} ></Route>

					<Route path='/hi' component={Home} ></Route>
				</div>

>>>>>>> deb722a3539e30dbe49fc148465920173bebca44
			</BrowserRouter>
		)
	}
}
ReactDOM.render(
	(
		<App />

), document.getElementById('root'));

module.hot.accept();
