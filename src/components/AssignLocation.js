import React, { Component } from "react";
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';
import Camera from './Camera';
import FinishCheckIn from './FinishCheckIn';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

class AssignCamp extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.addFound = this.addFound.bind(this);
    this.assign = this.assign.bind(this);
  }
  componentDidMount(){
    console.log(this.state);
    this.stitchClient = stitchClient;
    this.db = db;
  }
  addFound(person) {
    this.db
      .collection("found")
      .insertOne(person)
      .catch(console.error);
  }
  assign(campsite) {
    const person = {...this.state, campsite : campsite};
    delete person.found;
    this.addFound(person);
  }

  render() {
    return(
      <div>
      <h3>Assign Location</h3>
        <button onClick={() => this.assign('A')}>Campsite A</button>
        <p></p>
        <button onClick={() => this.assign('B')}>Campsite B</button>
        <p></p>
        <button onClick={() => this.assign('C')}>Campsite C</button>
      </div>
    );
  }
}

const AssignLocation = ({match}) => (
      <Router>
        <Route exact path={`${match.path}`} component={AssignCamp} />
        <Route path={`${match.path}/finish`} component={FinishCheckIn} />
      </Router>
    );

export default AssignLocation;
