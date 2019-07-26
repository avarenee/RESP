import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {Card, CardImg, CardBody, CardText} from 'reactstrap';
import AssignLocation from './AssignLocation';

export function searchToCard(person) {
  const cardAttributes = [`Name: ${person.first} ${person.last}`,
                          `Sex: ${person.sex}`,
                          (person.age_min || person.age_max) && `Age: ${person.age_min}-${person.age_max} yrs`,
                          (person.height_min || person.height_max) && `Height: ${person.height_min}-${person.height_max} cm`,
                          (person.weight_min || person.weight_max) && `Weight: ${person.weight_min}-${person.weight_max} kg`,
                          person.description && `Description : ${person.description}`];
  return (
    <div>
      <Card>
        <CardImg width="320" height="240" src={person.picture} alt="No picture available"/>
        <CardBody>
          {cardAttributes.map(attribute => <CardText>{attribute}</CardText>)}
        </CardBody>
      </Card>
    </div>
  );
}

export function personToCard(someone) {
  const cardAttributes = [`Name: ${someone.first} ${someone.last}`,
                          `Sex: ${someone.sex}`,
                          someone.dob && `Date of Birth: ${someone.dob}`,
                          someone.height && `Height: ${someone.height} cm`,
                          someone.weight && `Weight: ${someone.weight} kg`,
                          someone.description && `Description : ${someone.description}`,
                          someone.campsite && `Currently assigned to : Campsite ${someone.campsite}`];
  return (
    <div>
      <Card>
        <CardImg width="320" height="240" src={someone.picture}/>
        <CardBody>
          {cardAttributes.map(attribute => <CardText>{attribute}</CardText>)}
        </CardBody>
      </Card>
    </div>
  );
}

class DisplayFound extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state}
  }
  render() {
    return(
      <div>
        <h3>Person Found</h3>
        <p></p>
        {this.state.found.map(searchToCard)}
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
