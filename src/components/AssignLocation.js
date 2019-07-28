import React, { Component } from "react";
import { stitchClient, db } from '../stitch/database';
import { PersonToCard } from './PersonFound';
import {CheckInForm} from './CheckIn';
import FinishCheckIn from './FinishCheckIn';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import campsites from './campsites.json';
var mongodb = require('mongodb');

function campsiteToButton(campsite) {
  return (<div>
            <label>
            <Field
              name="campsite"
              component="input"
              type="radio"
              value={campsite.name}
              />{' '}
              Campsite {campsite.name}
            </label>
            <p></p>
          </div>);
}

export class AssignCamp extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.modal = false;
    this.toNext = false;
  }
  componentDidMount() {
    this.person = {...this.state};
  }
  render() {
    const onSubmit = (values) => {
      this.person = {...this.person, campsite : values.campsite}
      delete this.person.found;
      delete this.person.reunite;
      delete this.person.looked_for_by;
      delete this.person.relation;
      delete this.person.id_to_delete;
      delete this.person.looked_for_campsite;
      delete this.person.looked_for_picture;
      toggle();
    };
    const toggle = () => {
      this.modal = !this.modal;
      this.setState(this.state);
    };
    const addFound = () => {
      if(this.state.reunite) {
        db
          .collection("missing")
          .deleteOne({_id : mongodb.ObjectId(this.state.id_to_delete)})
          .catch(console.error);
      }
      db
        .collection("found")
        .insertOne(this.person)
        .then(result => {
          var id = result.insertedId.toHexString();
          this.nextPage = <Redirect push to={{pathname: `${this.props.match.url}/finish`, state: {...this.person, id: id}}}/>;
          this.toNext = true;
          this.setState(this.state);
        })
        .catch(console.error);
    }
    const toRefill = () => {
      this.nextPage = <Redirect push to={{pathname: '/check-in', state: {...this.person}}}/>;
      this.toNext = true;
      this.setState(this.state);
    };
    const header = this.state.reunite ? <h3>
                                            Reuniting {this.state.first} with {this.state.looked_for_by} ({this.state.relation})
                                        </h3>
                                      : <h3>Assign Location</h3>
    const images = <div>
                     <img width="160" height="120" src={this.state.picture}/>{' ----> '}
                     <img width="160" height="120" src={this.state.looked_for_picture}/>
                   </div>;
    if(this.toNext) {
      return this.nextPage;
    }
    return(
      <div>
      {header}
      {this.state.reunite && images}
      <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{campsite : this.state.looked_for_campsite}}
        render={({ handleSubmit, form, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            {campsites.campsites.map(campsiteToButton)}
          </div>
          <div className="buttons">
              <button type="submit">
                Finish
              </button>
            </div>
        </form>
        )}/>
      </div>
        <Modal isOpen={this.modal} toggle={toggle}>
          <ModalHeader>Is this information correct?</ModalHeader>
          <ModalBody>
            <PersonToCard person={this.person}/>
          </ModalBody>
          <ModalFooter><button onClick={addFound}>Yes</button>{' '}<button onClick={toRefill}>No</button></ModalFooter>
        </Modal>
      </div>
    );
  }
}

const AssignLocation = ({match}) => (
      <Switch>
        <Route exact path={`${match.path}`} component={AssignCamp} />
        <Route path={`${match.path}/finish`} component={FinishCheckIn} />
        <Route path='/check-in' component={CheckInForm} />
      </Switch>
  );

export default AssignLocation;
