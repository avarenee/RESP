import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {Form, Field} from 'react-final-form';
import Camera from './Camera';
import PersonFound from './PersonFound';
import { db } from '../stitch/database';
import { checkInAlgorithm } from '../utils/SearchAlgorithms'
import AssignLocation from '../utils/AssignLocation';
import './../css/forms.css';
import styled from 'styled-components';

export class CheckInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.picture = this.state.picture;
    this.toNext = false;
    this.storePictureURI = this.storePictureURI.bind(this);
  }


  storePictureURI(uri) {
    this.picture = uri;
    this.setState(this.state);
  }

  render() {
    const onSubmit = async (values) => {
      values.height = parseInt(values.height) || null;
      values.weight = parseInt(values.weight) || null;
      const person = {...values, picture : this.picture};
      var matches = [];

      const potentialMatches = checkInAlgorithm(person, { limit: 20 });

      await db
        .collection('missing')
        .find(potentialMatches)
        .toArray()
        .then(people => {
          people.forEach(match => {
            match._id = match._id.toHexString();
            matches.push(match)});
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));

      this.info = {...person, found : matches};
      this.nextPage =
        this.info.found.length > 0 ? <Redirect push to={{pathname: `${this.props.match.url}/found`, state: {...this.info}}}/>
                                   : <Redirect push to={{pathname: `${this.props.match.url}/assign-location`, state: person}}/>;
      this.toNext = true;
      this.setState(this.state);
    }
    if (this.toNext) {
      return this.nextPage
    }
    return(
        <body className="respform">
          <H2>Check In</H2>
        <div className="container">
        <div className="col">
        <Form
          onSubmit={onSubmit}
          initialValues={{first : this.state.first,
                          last : this.state.last,
                          dob : this.state.dob,
                          sex : this.state.sex || 'Unknown',
                          height : this.state.height,
                          weight : this.state.weight,
                          description : this.state.description}}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
          <div>
              <label>First Name</label>
              <MyField
                required
                name="first"
                component="input"
                type="text"
              />
            </div>
            <div>
              <label>Last Name</label>
              <MyField
                required
                name="last"
                component="input"
                type="text"
              />
            </div>
            <div>
              <label>Date of Birth</label>
              <MyField
                name="dob"
                component="input"
                type="date"
              />
            </div>
            <div>
              <label>Sex</label>
              <Div>
                <label>
                <Field
                  name="sex"
                  component="input"
                  type="radio"
                  value="Male"
                />{' '}
                Male
                </label>
                <label>
                <Field
                  name="sex"
                  component="input"
                  type="radio"
                  value="Female"
                />{' '}
                Female
                </label>
                <label>
                <Field
                  name="sex"
                  component="input"
                  type="radio"
                  value="Unknown"
                />{' '}
                Unknown
                </label>
              </Div>
              </div>
              <div>
                <label>Height</label>
                  <MyField
                    name="height"
                    component="input"
                    type="number"
                    placeholder="cm"
                  />
                  <label>Weight</label>
                    <MyField
                      name="weight"
                      component="input"
                      type="number"
                      placeholder="kg"
                    />
              </div>
              <div>
                <label>Description</label>
                <MyField
                  name="description"
                  component="textarea"
                  placeholder="Description"
                />
              </div>

                <Button type="submit" disabled={submitting || pristine}>
                  Next
                </Button>
            </form>
          )}/>
          </div>
          <div className="col">
            <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
          </div>
        </div>
        </body>
    );
  }
}

const CheckIn = ({match}) => (
      <Switch>
        <Route exact path={`${match.path}`} component={CheckInForm} />
        <Route path={`${match.path}/found`} component={PersonFound} />
        <Route path={`${match.path}/assign-location`} component={AssignLocation} />
      </Switch>
);

export default CheckIn;

const H2 = styled.h2`
  text-align: center;
  font-weight: normal;
  font-size: 36px;
  color: #160f6f;
`;

const Div = styled.div`
  display: inline-box;
  padding-bottom: 20px;
`;

const MyField = styled(Field)`
  border: none;
  border-bottom: 3px solid #160f6f;
  margin-bottom: 30px;
  padding: 5px 0px;
  width: 300px;
  background-color: #b0caed;
`;

const Button = styled.button`
  border: none;
  color: white;
  min-width: 200px;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 18px;
  text-align: center;
  background-color: #160f6f;
`;
