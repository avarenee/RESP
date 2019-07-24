import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {Card} from 'reactstrap';
import AssignLocation from './AssignLocation';

class DisplayFound extends Component {
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

const PersonFound = ({match}) => (
      <Router>
        <Route exact path={`${match.path}`} component={DisplayFound} />
        <Route path={`${match.path}/assign-location`} component={AssignLocation} />
      </Router>
    );

export default PersonFound;
