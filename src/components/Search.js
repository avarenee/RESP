import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import {Form, Field} from 'react-final-form';
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';

import PersonFound from './PersonFound';
import Camera from './Camera';

const AdvancedSearch = props => (
  <Fragment>
  <div>
    <label>Age Range</label>
    {' '}
    0
    <Field
      name="age_min"
      component="input"
      type="range"
      min="0"
      max={props.values.age_max}
    />
    {' '}
    {props.values.age_min || '0'}
    {' - '}
    {props.values.age_max || '100'}
    {' '}
    <Field
      name="age_max"
      component="input"
      type="range"
      min={props.values.age_min}
      max="100"
    />
    100
  </div>
  <div>
    <label>Height</label>
    {' '}
    0 cm
    <Field
      name="height_min"
      component="input"
      type="range"
      min="0"
      max={props.values.height_max}
    />
    {' '}
    {props.values.height_min || '0'}
    {' - '}
    {props.values.height_max || '225'}
    {' cm'}
    <Field
      name="height_max"
      component="input"
      type="range"
      min={props.values.height_min}
      max="225"
    />
    225 cm
  </div>
  <div>
    <label>Weight</label>
    {' '}
    0 kg
    <Field
      name="weight_min"
      component="input"
      type="range"
      min="0"
      max={props.values.weight_max}
    />
    {' '}
    {props.values.weight_min || '0'}
    {' - '}
    {props.values.weight_max || '200'}
    {' kg'}
    <Field
      name="weight_max"
      component="input"
      type="range"
      min={props.values.weight_min}
      max="200"
    />
    200 kg
  </div>
  <div>
    <label>Description</label>
    <Field
      name="description"
      component="textarea"
      placeholder="Description"
    />
  </div>
  </Fragment>
);

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: undefined,
      advanced: false,
      toHome: false,
    };
    this.addFound = this.addFound.bind(this);
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
  addFound(person) {
    this.db
      .collection("missing")
      .insertOne(person)
      .catch(console.error);
  }
  render() {
    const advanced = !this.state.advanced
    const showAdvanced = () => this.setState({advanced});
    const onSubmit = async (values) => {
      const pictureURI = this.state.picture;
      values.age_min = parseInt(values.age_min) || null;
      values.age_max = parseInt(values.age_max) || null;
      values.height_min = parseInt(values.height_min) || null;
      values.height_max = parseInt(values.height_max) || null;
      values.weight_min = parseInt(values.weight_min) || null;
      values.weight_max = parseInt(values.weight_max) || null;
      const person = {...values, picture : pictureURI};
      this.addFound(person);
    }

      /*
      const pictureURI = this.state.picture;
      this.info = {...values, pictureURI};
      await this.db.collection('found')
        .find({$text : {first : this.info.first}}, { limit: 20 })
        .toArray()
        .then(people => {
          people.forEach(person => matches.push(person));
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));
      this.setState({toHome: true});
    }
    if (this.state.toHome) {
      return <Redirect push to={{pathname: `${this.props.match.url}/add-missing`, state: {...this.info}}}/>
    }
    */
    return(
        <div>
        <h3>Search</h3>
        <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
        <Form
          onSubmit={onSubmit}
          initialValues={{first : null,
                          middle : null,
                          last : null,
                          sex : 'Unknown',
                          age_min: null,
                          age_max: null,
                          weight_min: null,
                          weight_max: null,
                          height_min: null,
                          height_max: null,
                          description: null}}
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
            </div>
            <div>
              <button type="button" onClick={showAdvanced}>Advanced Search</button>
            </div>
            {this.state.advanced && <AdvancedSearch values={{...values}}/>}
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

class AddMissing extends Component {
  render() {
    return(
      <h3>Add Missing</h3>
    );
  }
}

const Search = ({match}) => (
      <Router>
        <Route exact path={`${match.path}`} component={SearchForm} />
        <Route path={`${match.path}/found`} component={PersonFound} />
        <Route path={`${match.path}/add-missing`} component={AddMissing} />
      </Router>
    );

export default Search;
