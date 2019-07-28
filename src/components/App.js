import React, { Component } from "react";
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import CheckIn from './CheckIn';
import Search from './Search';
import { loginAnonymous } from './../stitch/auth';
import { stitchClient, db } from '../stitch/database';
import resp from './../assets/RESPlogo.png';
import './../css/main.css';

export function Home() {
  return(
      <div>
        <img alt="Logo not available" src={resp} />
        <h1>RESP</h1>
        <h2>Responsive Emotional Support Protocols for First Responders</h2>
        <div class="buttons">
          <Link to='/check-in'><button class="button checkin" type="button">New Check-in</button></Link>
        <p></p>
          <Link to='/search'><button class="button search" type="button">New Search</button></Link>
        </div>
      </div>
  );
}

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
      <body className="home">
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/check-in' component={CheckIn}/>
            <Route path='/search' component={Search}/>
          </Switch>
        </Router>
      </body>
    );
  }
}

export default App;
