import React, {Component, Fragment} from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import {Form, Field} from 'react-final-form';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import Camera from './Camera';

const AdvancedSearch = (
  <Fragment>
  <div>
    <label>Age Range</label>
    {' '}
    0
    <Field
      name="age"
      component="input"
      type="range"
      min="0"
      max="100"
    />
    100
  </div>
  <div>
    <label>Height</label>
    {' '}
    2'0"
    <Field
      name="height"
      component="input"
      type="range"
      min="24"
      max="86"
    />
    7'0"
  </div>
  <div>
    <label>Weight</label>
    {' '}
    50
    <Field
      name="weight"
      component="input"
      type="range"
      min="50"
      max="350"
    />
    350
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

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: undefined,
      advanced: false,
    };
    this.storePictureURI = this.storePictureURI.bind(this);
  }
  storePictureURI(uri) {
    this.setState({picture: uri});
  }
  render() {
    const advanced = !this.state.advanced
    const showAdvanced = () => this.setState({advanced});
    const onSubmit = (values) => {
      console.log(values);
    }
    return(
      <div>
      <h3>Search</h3>
      <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
      <Form
        onSubmit={onSubmit}
        initialValues={{sex : 'Unknown'}}
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
            <button onClick={showAdvanced}>Advanced Search</button>
          </div>
          {this.state.advanced && AdvancedSearch}
          <div className="buttons">
              <button type="submit" disabled={submitting || pristine}>
                Submit
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
