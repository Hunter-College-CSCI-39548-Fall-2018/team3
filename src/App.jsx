import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {
	
	render(){
		const element = <h1>Biscuit</h1>;
		return(element)
	}
}
ReactDOM.render(
	(
		<App />
		// React.createElement('div',null,'HEllo world')
		
	
), document.getElementById('root'));

module.hot.accept();
