import React, { Component } from "react";
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';
import Camera from './Camera';
export default class AssignLocation extends Component {
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
    };
    this.addFound = this.addFound.bind(this);
    this.assign = this.assign.bind(this);
  }
  componentDidMount(){
    this.stitchClient = stitchClient;
    this.db = db;
    loginAnonymous();
  }
  addFound(person) {
    this.db
      .collection("found")
      .insertOne(person)
      .catch(console.error);
  }
  assign(campsite) {
    const person = {...this.state, campsite : campsite};
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
