import React, { Component } from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import CheckIn from './CheckIn';
import Search from './Search';
import { loginAnonymous } from './../stitch/auth';
import { stitchClient, db } from '../stitch/database';
import Home from './Home';

class App extends Component {
  async componentDidMount() {
    loginAnonymous();

    // NOTE: this is just for testing so you can easily see the people in each collection
    this.client = stitchClient;
    this.db = db;

    const missingPeople = await this.db.collection('missing').find().toArray();
    const foundPeople = await this.db.collection('found').find().toArray();
    console.log('MISSING PEOPLE: ', missingPeople);
    console.log('FOUND PEOPLE: ', foundPeople);

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
