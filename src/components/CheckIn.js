import React, {Component} from 'react';
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';
import { checkInAlgorithm } from './SearchAlgorithms'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import {Form, Field} from 'react-final-form';

import Camera from './Camera';

import PersonFound from './PersonFound';
import AssignLocation from './AssignLocation';

class CheckInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: undefined,
      toNext: false,
    };
    this.storePictureURI = this.storePictureURI.bind(this);
  }
  componentDidMount() {
    this.client = stitchClient;
    this.db = db;
    loginAnonymous();
  }
  storePictureURI(uri) {
    this.setState({picture: uri});
  }

  render() {
    const onSubmit = async (values) => {
      const pictureURI = this.state.picture;
      values.height = parseInt(values.height) || null;
      values.weight = parseInt(values.weight) || null;
      this.info = {...values, picture : pictureURI};
      var matches = [];
      await this.db.collection('missing')
        .find(checkInAlgorithm(this.info), { limit: 20 })
        .toArray()
        .then(people => {
          people.forEach(person => matches.push(person));
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));
      console.log(matches);
      this.info = {...this.info, found : matches}
      this.nextPage =
        this.info.found.length > 0 ? <Redirect push to={{pathname: `${this.props.match.url}/found`, state: {...this.info}}}/>
                                   : <Redirect push to={{pathname: `${this.props.match.url}/assign-location`, state: {...this.info}}}/>;
      this.setState({toNext : true});
    }
    if (this.state.toNext) {
      return this.nextPage
    }
    return(
        <div>
        <h3>Check In</h3>
        <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
        <Form
          onSubmit={onSubmit}
          initialValues={{first : null,
                          middle : null,
                          last : null,
                          dob : null,
                          sex : 'Unknown',
                          height : null,
                          weight : null,
                          description : null }}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
          <div>
              <label>First Name</label>
              <Field
                name="first"
                component="input"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div>
              <label>Middle Name</label>
              <Field
                name="middle"
                component="input"
                type="text"
                placeholder="Middle Name"
              />
            </div>
            <div>
              <label>Last Name</label>
              <Field
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
                  Search
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
      <Router>
        <Route exact path={`${match.path}`} component={CheckInForm} />
        <Route path={`${match.path}/found`} component={PersonFound} />
        <Route path={`${match.path}/assign-location`} component={AssignLocation} />
      </Router>
    );

export default CheckIn;
