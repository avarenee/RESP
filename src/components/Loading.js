import React, { Component } from "react";
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import PersonFound from './PersonFound';
import AssignLocation from './AssignLocation';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner_id: this.props.owner_id,
      first: this.props.first,
      last: this.props.last,
      mi: this.props.mi,
      dob: this.props.dob,
      sex: this.props.sex,
      height: this.props.height,
      weight: this.props.weight,
      description: this.props.description,
      picture: this.props.picture,
      moveOn: false,
      found: []
    };
    this.anyMatches = this.anyMatches.bind(this);
  }
  componentDidMount() {
    this.client = stitchClient;
    this.db = db;
    loginAnonymous();
    this.anyMatches();
  }

  async anyMatches() {
    this.moveOn = true;
    var matches = [];
    console.log('matching...');
    await this.db.collection('missing')
      .find({first : this.props.first}, { limit: 20 })
      .toArray()
      .then(people => {
        people.forEach(person => matches.push(person));
      })
      .catch(err => console.error(`Failed to find documents: ${err}`));
    this.setState({found : matches});
    this.setState({moveOn: true});
  }

  render() {
    const loading = <h3>Loading...</h3>
    const nextpage = !(this.state.found.length === 0) ? <PersonFound {...this.state}/> : <AssignLocation {...this.state}/>
    return(
      !this.moveOn ? loading : nextpage
    );
  }
}
