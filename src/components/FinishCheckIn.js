import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import { personToCard } from './PersonFound';
import { db } from '../stitch/database';

export default class FinishCheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.toNext = false;
  }

  render() {
    const toSearch = () => {
      this.nextPage = <Redirect push exact to={{pathname : '/search', state : {name : `${this.state.first} ${this.state.last}`, id: this.id}}}/>;
      this.toNext = true;
      this.setState(this.state);
    }
    const backHome = () => {
      this.nextPage = <Redirect push exact to='/'/>;
      this.toNext = true;
      this.setState(this.state);
    }
    if(this.toNext) {
      return this.nextPage
    }
    return(
      <div>
        <h2>Finished Checking in {this.state.first} {this.state.last}!</h2>
        <p></p>
        {personToCard(this.state)}
        <p></p>
        <h3>Is there anyone you'd like to search for, {this.state.first}?</h3>
        <p></p>
        <button onClick={toSearch}>Yes</button><button onClick={backHome}>No thank you</button>
      </div>
    );
  }
}
