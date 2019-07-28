import React, { Component } from 'react';
import FinishSearch from './FinishSearch';
import { PersonToCard } from './PersonFound';
import { Switch, Route, Redirect } from 'react-router-dom';

export class DisplaySearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
    this.showLocation = false;
    this.toNext = false;
    this.cardSelect = this.cardSelect.bind(this);
  }
  cardSelect(person) {
    this.location = person.campsite;
    this.found_name = `${person.first} ${person.last}`;
    this.showLocation = true;
    this.setState(this.state);
  }
  render() {
    const message = this.state.found.length > 1 ? `${this.state.found.length} potential matches found!`
                                                : '1 Potential Match Found!';
    if(this.toNext) {
      return <Redirect push to={{pathname: `${this.props.match.path}/finish`, state : this.state}}/>;
    }
    return(
      <div>
        <h3>{message}</h3>
        <p></p>
        {this.state.found.map((person) => <PersonToCard person={person} cardSelect={this.cardSelect} />)}
        <p></p>
        Are any of these search results accurate?
        <p></p>
        {this.showLocation ? <h4>{this.found_name} has been checked in and is located at Campsite {this.location}</h4>: null}
        <p></p>
        <button onClick={() => {this.toNext = true; this.setState(this.state)}}>Finish Search</button>
      </div>
    );
  }
}

const SearchSuccessful = ({match}) => (
      <Switch>
        <Route exact path={`${match.path}`} component={DisplaySearchResults} />
        <Route path={`${match.path}/finish`} component={FinishSearch} />
      </Switch>
    );

export default SearchSuccessful;
