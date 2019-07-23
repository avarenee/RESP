import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

export default class PersonFound extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props.location.state);
  }
  render() {
    return(
      <Router>
      <div>
      <h3>Person Found</h3>
      </div>
      </Router>
    );
  }
}
