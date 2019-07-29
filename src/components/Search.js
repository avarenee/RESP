import React, {Component, Fragment} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {Form, Field} from 'react-final-form';
import SearchSuccessful from './SearchSuccessful';
import { stitchClient, db } from '../stitch/database';
import { searchAlgorithm, advancedSearchAlgorithm } from '../utils/SearchAlgorithms';
import './../css/forms.css';
import styled from 'styled-components';

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
    <MyField
      name="description"
      component="textarea"
      placeholder="Description"
    />
  </div>
  </Fragment>
);

export class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.picture = this.state.picture;
    this.advanced = false;
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
    const showAdvanced = () => {this.advanced = !this.advanced ; this.setState(this.state)};
    const onSubmit = async (values) => {
      values.age_min = parseInt(values.age_min) || null;
      values.age_max = parseInt(values.age_max) || null;
      values.height_min = parseInt(values.height_min) || null;
      values.height_max = parseInt(values.height_max) || null;
      values.weight_min = parseInt(values.weight_min) || null;
      values.weight_max = parseInt(values.weight_max) || null;
      const picture = this.picture;
      const person = {...values, picture : picture, looked_for_by : this.state.looked_for_by, looked_for_by_id: this.state.looked_for_by_id};
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
                                   : <Redirect push to={{pathname: `${this.props.match.url}/add-missing`, state: {...person}}}/>;
      this.toNext = true;
      this.setState(this.state);
    }
    if (this.toNext) {
      return this.nextPage;
    }
    return(
        <body className="respform">
        <H2>Search</H2>
        <div className="container">
        <div className="col">
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
              <AdvancedButton type="button" onClick={showAdvanced}>Advanced Search ⌄</AdvancedButton>
            </div>
            {this.advanced && <AdvancedSearch values={{...values}}/>}
            <div>
                <Button type="submit" disabled={submitting || pristine}>
                  Search
                </Button>
              </div>
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

const Search = ({match}) => (
    <body className="respform">
      <Switch>
        <Route exact path={`${match.path}`} component={SearchForm} />
        <Route path={`${match.path}/found`} component={SearchSuccessful} />
        <Route path={`${match.path}/add-missing`} component={AddMissing} />
      </Switch>
    </body>
    );

export default Search;

const H2 = styled.h2`
  text-align: center;
  font-weight: normal;
  font-size: 36px;
  color: tomato;
`;

const Div = styled.div`
  display: inline-box;
  padding-bottom: 20px;
`;

const MyField = styled(Field)`
  border: none;
  border-bottom: 3px solid tomato;
  margin-bottom: 30px;
  padding: 5px 0px;
  min-width: 300px;
  background-color: #ffdad4;
`;

const Button = styled.button`
  border: none;
  color: white;
  min-width: 200px;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 18px;
  text-align: center;
  background-color: tomato;
`;

const AdvancedButton = styled.button`
  border: none;
  color: tomato;
  background-color: #fff;
  padding-left: 0px;
  padding-bottom: 20px;
  padding-top: 0px;
  font-size: 24px;
`;
