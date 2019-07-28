import React, { Component, Fragment } from "react";
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import CheckIn from './CheckIn';
import Search from './Search';
import AssignLocation from './AssignLocation';
import { loginAnonymous } from './../stitch/auth';

export function Home() {
  return(
      <div>
        <Link to='/check-in'><button type="button">New Check-in</button></Link>
      <p></p>
        <Link to='/search'><button type="button">New Search</button></Link>
      </div>
  );
}

class App extends Component {
  componentDidMount() {
    loginAnonymous();
  }
  render() {
    return(
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/check-in' component={CheckIn}/>
            <Route path='/search' component={Search}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
