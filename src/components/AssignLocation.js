import React, { Component } from "react";
import { stitchClient, db } from '../stitch/database';
import { personToCard } from './PersonFound';
import FinishCheckIn from './FinishCheckIn';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import campsites from './campsites.json'

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

class AssignCamp extends Component {
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
      toggle();
    };
    const toggle = () => {
      this.modal = !this.modal;
      this.setState(this.state);
    };
    const addFound = () => {
      db
        .collection("found")
        .insertOne(this.person)
        .then(result =>
          this.id = result.insertedId)
        .catch(console.error);
      this.nextPage = <Redirect push to={{pathname: `${this.props.match.url}/finish`, state: {...this.person, id: this.id}}}/>;
      this.toNext = true;
      this.setState(this.state);
    }
    const toRefill = () => {
      this.nextPage = <Redirect push to={{pathname: '/check-in', state: {...this.person}}}/>;
      this.toNext = true;
      this.setState(this.state);
    };
    if(this.toNext) {
      return this.nextPage;
    }
    return(
      <div>
      <h3>Assign Location</h3>
      <div>
      <Form
        onSubmit={onSubmit}
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
          <ModalBody>{personToCard({...this.person})}</ModalBody>
          <ModalFooter><button onClick={addFound}>Yes</button>{' '}<button onClick={toRefill}>No</button></ModalFooter>
        </Modal>
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
