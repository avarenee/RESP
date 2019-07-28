import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {Form, Field} from 'react-final-form';
import Camera from './Camera';
import PersonFound from './PersonFound';
import { loginAnonymous } from '../stitch/auth';
import { stitchClient, db } from '../stitch/database';
import { checkInAlgorithm } from '../utils/SearchAlgorithms'
import AssignLocation from '../utils/AssignLocation';

export class CheckInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.picture = this.state.picture;
    this.toNext = false;
    this.storePictureURI = this.storePictureURI.bind(this);
  }
  componentDidMount() {
    this.client = stitchClient;
    this.db = db;
  }

  storePictureURI(uri) {
    this.picture = uri;
    this.setState(this.state);
  }

  render() {
    const onSubmit = async (values) => {
      const pictureURI = this.picture;
      values.height = parseInt(values.height) || null;
      values.weight = parseInt(values.weight) || null;
      const person = {...values, picture : this.picture};
      var matches = [];

      const potentialMatches = checkInAlgorithm(person, { limit: 20 });

      await this.db.collection('missing')
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
        <div>
        <h3>Check In</h3>
        <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
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
              <Field
                required
                name="first"
                component="input"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div>
              <label>Last Name</label>
              <Field
                required
                name="last"
                component="input"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label>Date of Birth</label>
              <Field
                name="dob"
                component="input"
                type="date"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label>Sex</label>
              <div>
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
              </div>
              <div>
                <label>Height</label>
                  <Field
                    name="height"
                    component="input"
                    type="number"
                    placeholder="cm"
                  />
              </div>
              <div>
                <label>Weight</label>
                    <Field
                      name="weight"
                      component="input"
                      type="number"
                      placeholder="kg"
                    />
              </div>
              <div>
                <label>Description</label>
                <Field
                  name="description"
                  component="textarea"
                  placeholder="Description"
                />
              </div>
            </div>
            <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  Next
                </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div>
            </form>
          )}/>
        </div>
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
