import React, { Component } from "react";
import {Route, Redirect, Switch} from 'react-router-dom';
import Home from './Home';
import { PersonToCard } from './PersonFound';
import {SearchForm} from './Search';

class Finish extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.toNext = false;
  }
  render() {
    const toSearch = () => {
      this.nextPage = <Redirect to={{pathname : '/search', state : {looked_for_by : `${this.state.first} ${this.state.last}`, looked_for_by_id: this.state.id}}}/>;
      this.toNext = true;
      this.setState(this.state);
    }
    const toHome = () => {
      this.nextPage = <Redirect to='/'/>;
      this.toNext = true;
      this.setState(this.state);
    }
    if(this.toNext) {
      return this.nextPage
    }
    return(
      <div>
        <h2>Finished Checking in {this.state.first} {this.state.last}!</h2>
        <p></p>
        <PersonToCard person={this.state}/>
        <p></p>
        <h3>Is there anyone {this.state.first} would like to search for?</h3>
        <p></p>
        <button onClick={toSearch}>Yes</button><button onClick={toHome}>No thank you</button>
      </div>
    );
  }
}

const FinishCheckIn = ({match}) => (
      <Switch>
        <Route exact path={`${match.path}`} component={Finish}/>
        <Route path='/' component={Home}/>
        <Route path='/search' component={SearchForm}/>
      </Switch>
);

export default FinishCheckIn;
