import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import { db } from '../stitch/database';
import { SearchToCard } from './PersonFound';
import FinishSearch from './FinishSearch';

const Relation = (props) => (
  <div>
    (Optional) Add the searcher's relationship to the person you are searching (mother, child, friend, etc.):
    <p></p>
    <label>
      Relation:
      <input type="text" value={props.relation} onChange={props.saveRelation}/>
    </label>
    <div>
      <button onClick={props.addMissing}>Add Entry</button>
    </div>
  </div>
);

export class Missing extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state, relation : null};
    this.toNext = false;
    this.show = false;
    this.addMissing = this.addMissing.bind(this);
    this.saveRelation = this.saveRelation.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  addMissing() {
    const person = {...this.state};
    db
      .collection("missing")
      .insertOne(person)
      .catch(console.error);
    this.toNext = true;
    this.setState(this.state);
  }
  saveRelation(event) {
    this.setState({relation : event.target.value});
  }
  toggle() {
    this.show = !this.show;
    this.setState(this.state);
  }
  render() {
    const show = false;
    const person = {...this.state};
    if(this.toNext) {
      return <Redirect to={{pathname : `${this.props.match.path}/finish`, state : person}}/>;
    }
    return(
        <div>
          <h2>This person has not yet been checked in</h2>
          <p></p>
            <SearchToCard person={this.state}/>
          <p></p>
          <h3>Would you like to start a missing person's entry for them?</h3>
          <p></p>
          <button onClick={this.toggle}>Yes</button>
          <button onClick={() => {this.toNext = true; this.setState(this.state)}}>No</button>
          {this.show && <Relation relation={this.state.relation}
                             saveRelation={this.saveRelation}
                             addMissing={this.addMissing}
          />}
        </div>
    );
  }
}

const AddMissing = ({match}) => (
      <Switch>
        <Route exact path={`${match.path}`} component={Missing}/>
        <Route path={`${match.path}/finish`} component={FinishSearch}/>
      </Switch>
);

export default AddMissing;
