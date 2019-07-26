import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import {Form, Field} from 'react-final-form';
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';
import { searchAlgorithm, advancedSearchAlgorithm } from './SearchAlgorithms';

import AddMissing from './AddMissing'

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
    <Field
      name="age_max"
      component="input"
      type="range"
      min={props.values.age_min}
      max="100"
    />
    100
    {'    '}
    {props.values.age_min || '0'}
    {' - '}
    {props.values.age_max || '100'}
    {' '}
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
    <Field
      name="height_max"
      component="input"
      type="range"
      min={props.values.height_min}
      max="225"
    />
    225 cm
    {'    '}
    {props.values.height_min || '0'}
    {' - '}
    {props.values.height_max || '225'}
    {' cm'}
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
    <Field
      name="weight_max"
      component="input"
      type="range"
      min={props.values.weight_min}
      max="200"
    />
    200 kg
    {'    '}
    {props.values.weight_min || '0'}
    {' - '}
    {props.values.weight_max || '200'}
    {' kg'}
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
    this.state = {...this.props.location.state,
      picture: undefined,
    };
    this.advanced = false;
    this.toNext = false;
    this.storePictureURI = this.storePictureURI.bind(this);
  }
  componentDidMount() {
    this.client = stitchClient;
    this.db = db;
  }
  storePictureURI(uri) {
    this.setState({picture: uri});
  }
  render() {
    const showAdvanced = () => {this.advanced = !this.advanced ; this.setState(this.state)};
    const onSubmit = async (values) => {
      values.age_min = parseInt(values.age_min) || null;
      values.age_max = parseInt(values.age_max) || null;
      values.height_min = parseInt(values.height_min) || null;
      values.height_max = parseInt(values.height_max) || null;
      values.weight_min = parseInt(values.weight_min) || null;
      values.weight_max = parseInt(values.weight_max) || null;
      const pictureURI = this.state.picture;
      const person = {...values, picture : pictureURI};
      const algorithm = this.advanced ? advancedSearchAlgorithm : searchAlgorithm;
      var matches = [];
      await this.db.collection('found')
        .find(algorithm(person), { limit: 20 })
        .toArray()
        .then(people => {
          people.forEach(match => matches.push(match));
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));
      this.info = {...person, found : matches};
      this.nextPage =
        this.info.found.length > 0 ? <Redirect push to={{pathname: `${this.props.match.url}/found`, state: {...this.info}}}/>
                                   : <Redirect push to={{pathname: `${this.props.match.url}/add-missing`, state: {...this.info}}}/>;
      this.toNext = true;
      this.setState(this.state);
    }
    if (this.toNext) {
      return this.nextPage;
    }
    return(
        <div>
        <h3>Search</h3>
        <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
        <Form
          onSubmit={onSubmit}
          initialValues={{first : this.state.first,
                          last : this.state.last,
                          sex : this.state.sex || 'Unknown',
                          age_min: this.state.age_min,
                          age_max: this.state.age_max,
                          weight_min: this.state.weight_min,
                          weight_max: this.state.weight_max,
                          height_min: this.state.height_min,
                          height_max: this.state.height,
                          description: null}}
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
            {this.advanced && <AdvancedSearch values={{...values}}/>}
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

class SuccessfulSearch extends Component {
  render() {
    return(
      <h3>Successful Search</h3>
    );
  }
}

const Search = ({match}) => (
      <Router>
        <Route exact path={`${match.path}`} component={SearchForm} />
        <Route path={`${match.path}/found`} component={SuccessfulSearch} />
        <Route path={`${match.path}/add-missing`} component={AddMissing} />
      </Router>
    );

export default Search;
