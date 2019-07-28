import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import { Stitch } from "mongodb-stitch-browser-sdk";
import {Card, CardImg, CardBody, CardText} from 'reactstrap';
import AssignLocation from '../utils/AssignLocation';
import { db } from './../stitch/database';

var mongodb = require('mongodb');

export function SearchToCard(props) {
  const cardAttributes = [`Name: ${props.person.first} ${props.person.last}`,
                          `Sex: ${props.person.sex}`,
                          (props.person.age_min || props.person.age_max) && `Age: ${props.person.age_min}-${props.person.age_max} yrs`,
                          (props.person.height_min || props.person.height_max) && `Height: ${props.person.height_min}-${props.person.height_max} cm`,
                          (props.person.weight_min || props.person.weight_max) && `Weight: ${props.person.weight_min}-${props.person.weight_max} kg`,
                          props.person.description && `Description : ${props.person.description}`,
                          props.person.looked_for_by && `Looked for By: ${props.person.looked_for_by}`];
  return (
    <div>
      <Card onClick={() => props.cardSelect(props.person)}>
        <CardImg width="320" height="240" src={props.person.picture} alt="No picture available"/>
        <CardBody>
          {cardAttributes.map(attribute => <CardText>{attribute}</CardText>)}
        </CardBody>
      </Card>
    </div>
  );
}

export function PersonToCard(props) {
  const cardAttributes = [`Name: ${props.person.first} ${props.person.last}`,
                          `Sex: ${props.person.sex}`,
                          props.person.dob && `Date of Birth: ${props.person.dob}`,
                          props.person.height && `Height: ${props.person.height} cm`,
                          props.person.weight && `Weight: ${props.person.weight} kg`,
                          props.person.description && `Description : ${props.person.description}`,
                          props.person.campsite && `Currently assigned to : Campsite ${props.person.campsite}`];
  return (
    <div>
      <Card onClick={() => props.cardSelect(props.person)}>
        <CardImg width="320" height="240" src={props.person.picture} alt="No picture available"/>
        <CardBody>
          {cardAttributes.map(attribute => <CardText>{attribute}</CardText>)}
        </CardBody>
      </Card>
    </div>
  );
}

export class DisplayFound extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.toNext = false;
    this.cardSelect = this.cardSelect.bind(this);
    this.reunite = this.reunite.bind(this);
    this.noMatch = this.noMatch.bind(this);
  }
  cardSelect(person) {
    this.looked_for_by = person.looked_for_by;
    this.looked_for_by_id = person.looked_for_by_id;
    this.id_to_delete = person._id;
    this.relation = person.relation;
  }
  async reunite() {
    const searcher = await db
      .collection('found')
      .findOne({_id : mongodb.ObjectId(this.looked_for_by_id)}, {campsite : true, picture: true})
      .catch(err => console.error(`Failed to find documents: ${err}`));
    this.campsite = searcher.campsite;
    this.picture = searcher.picture;
    this.info = {...this.state,
                 reunite : true,
                 looked_for_by: this.looked_for_by,
                 relation: this.relation,
                 id_to_delete: this.id_to_delete,
                 looked_for_campsite: searcher.campsite,
                 looked_for_picture: searcher.picture};
    this.toNext = true;
    this.setState(this.state);
  }
  noMatch() {
    this.info = this.state;
    this.toNext = true;
    this.setState(this.state);
  }
  render() {
    const message = this.state.found.length > 1 ? `${this.state.found.length} potential matches found!`
                                                : '1 Potential Match Found!';
    if(this.toNext) {
      return <Redirect push to={{pathname: `${this.props.match.path}/assign-location`, state : this.info}}/>;
    }
    return(
      <div>
        <h3>{message}</h3>
        <p></p>
        {this.state.found.map((person) => <SearchToCard person={person} cardSelect={this.cardSelect} />)}
        <p></p>
        Does the checked-in person match the selected profile?
        <p></p>
        <button onClick={this.reunite}>Yes</button><button onClick={this.noMatch}>No</button>
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
