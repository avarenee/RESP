import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { db } from '../stitch/database';
import { searchToCard } from './PersonFound';

export default class AddMissing extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.addMissing = this.addMissing.bind(this);
  }
  addMissing() {
    const person = {...this.state};
    db
      .collection("missing")
      .insertOne(person)
      .catch(console.error);
  }
  render() {
    return(
        <div>
          <h2>This person has not yet been checked in</h2>
          <p></p>
            {searchToCard(this.state)}
          <p></p>
          <h3>Would you like to start a missing person's entry for them?</h3>
          <p></p>
          <button>Yes</button>
          <button>No</button>
          <div>
          </div>
        </div>
    );
  }
}
