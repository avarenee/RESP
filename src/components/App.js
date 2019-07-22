import React, { Component, Fragment } from "react";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import CheckIn from './CheckIn';
import Search from './Search';
import AssignLocation from './AssignLocation';

function Home() {
  return(
    <div>
      <Link to='/check-in'><button type="button">New Check-in</button></Link>
    <p></p>
      <Link to='/search'><button type="button">New Search</button></Link>
    </div>
  );
}

class App extends Component {
  render() {
    return(
      <Router>
        <div>
          <Route exact path='/' component={Home}/>
          <Route path='/check-in' component={CheckIn}/>
          <Route path='/search' component={Search}/>
        </div>
      </Router>
    );
  }
}

export default App;
