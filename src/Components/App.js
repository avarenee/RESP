import React, { Component } from "react";
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      people: [],
      form_data: {
        owner_id: undefined,
        first: undefined,
        last: undefined,
        mi: undefined,
        dob: undefined,
        sex: undefined,
        height: undefined,
        weight: undefined,
        race: undefined,
        campsite: undefined,
        description: undefined,
        image: undefined
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.displayFound = this.displayFound.bind(this);
    this.addFound = this.addFound.bind(this);
  }

  componentDidMount() {
    this.client = Stitch.initializeDefaultAppClient("resp-nqkab");
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("sample_disaster");
    this.displayPeopleOnLoad();
  }

  displayFound() {
    this.db
      .collection("found")
      .find({}, { limit: 1000 })
      .asArray()
      .then(people => {
        this.setState({people});
      });
   }
   displayPeopleOnLoad() {
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayFound)
      .catch(console.error);
  }
  addFound(event) {
    event.preventDefault();
    this.db
      .collection("found")
      .insertOne({
        owner_id: this.client.auth.user.id,
        first: this.state.first,
        last: this.state.last,
        mi: this.state.mi,
        dob: this.state.dob,
        sex: this.state.sex,
        height: this.state.height,
        weight: this.state.weight,
        race: this.state.race,
        campsite: this.state.campsite,
        description: this.state.description,
        image: this.state.image
      })
      .then(this.displayFound)
      .catch(console.error);
    this.setState()
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name] : value});
  }
  render() {
    return (
      <div>
        <h3>CheckIn</h3>
        <form onSubmit={this.addFound}>
          <label>
            First Name:
             <input name="first" type="text" value={this.state.first} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Last Name:
             <input name="last" type="text" value={this.state.last} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Middle Initial:
             <input name="mi" type="text" value={this.state.mi} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Date of Birth:
             <input name="dob" type="text" value={this.state.dob} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Sex:
             <input name="sex" type="text" value={this.state.sex} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Height:
             <input name="height" type="text" value={this.state.height} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Weight:
             <input name="weight" type="text" value={this.state.weight} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Campsite:
             <input name="race" type="text" value={this.state.race} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Description:
             <input name="description" type="text" value={this.state.description} onChange={this.handleChange} />
          </label>
          <p></p>
          <label>
            Image:
             <input name="image" type="text" value={this.state.image} onChange={this.handleChange} />
          </label>
          <p></p>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
