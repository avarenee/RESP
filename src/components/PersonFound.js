import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

export default class PersonFound extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state}
    this.personToCard = this.personToCard.bind(this);
  }
  personToCard(person) {
    return <h2>{person.last}</h2>;
  }
  render() {
    return(
      <div>
        <h3>Person Found</h3>
        <p></p>
        {this.state.found.map(this.personToCard)}
      </div>
    );
  }
}
