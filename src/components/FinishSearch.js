import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SearchToCard } from './PersonFound';

export default class FinishSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.location.state};
  }
  render() {
    return(
        <div>
          <h2>Search Finished!</h2>
          <p></p>
            <SearchToCard person={this.state}/>
          <p></p>
          <h3>Would you like to search again?</h3>
          <p></p>
          <Link to={{pathname: '/search', state: {looked_for_by : this.state.looked_for_by,
                                                  looked_for_by_id: this.state.looked_for_by_id}}}>
            <button>Yes</button>
          </Link>
          <Link to='/'>
            <button>No</button>
          </Link>
          <div>
          </div>
        </div>
    );
  }
}
