import React, {Component} from 'react';
import store, { writeName } from '../store';

export default class NameEntry extends Component{
	constructor(){
		super();
		this.state = store.dispatch(() => store.getState());
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount(){
		this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
	}

	componentWillUnmount(){
		this.unsubscribe();
	}


	handleChange(e){
		store.dispatch(writeName(e.target.value));
	}

	render(){
		const { handleChange } = this;
		return (
			<form className="form-inline" onChange={handleChange}>
			  <label htmlFor="name">Your name:</label>
			  <input
			    type="text"
			    name="name"
			    placeholder="Enter your name"
			    className="form-control"
			    value={this.state.newNameEntry}
			  />
			</form>
		)
		
	}
}

