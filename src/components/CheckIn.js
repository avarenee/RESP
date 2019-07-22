import React, {Component} from 'react';
import { stitchClient, db } from '../stitch/database';
import { loginAnonymous } from '../stitch/auth';
import Loading from './Loading';
import Camera from './Camera';

export default class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner_id: undefined,
      first: undefined,
      last: undefined,
      mi: undefined,
      dob: undefined,
      sex: undefined,
      height: undefined,
      weight: undefined,
      description: undefined,
      picture: undefined,
      moveOn: false
    };
    this.next = this.next.bind(this);
    this.handleFill = this.handleFill.bind(this);
    this.storePictureURI = this.storePictureURI.bind(this);
  }
  handleFill(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name] : value});
  }

  storePictureURI(uri) {
    this.setState({picture: uri});
  }
  next() {
    this.setState({moveOn : true});
  }
  render() {
        return !this.state.moveOn ?
          <div>
            <h3>Check-In</h3>
            <form id='checkin' onSubmit={this.next}>
              <label>
                First Name:
                 <input name="first" type="text" value={this.state.first} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Last Name:
                 <input name="last" type="text" value={this.state.last} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Middle Initial:
                 <input name="mi" type="text" value={this.state.mi} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Date of Birth:
                 <input name="dob" type="text" value={this.state.dob} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Sex:
                 <input name="sex" type="text" value={this.state.sex} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Height:
                 <input name="height" type="text" value={this.state.height} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Weight:
                 <input name="weight" type="text" value={this.state.weight} onChange={this.handleFill} />
              </label>
              <p></p>
              <label>
                Description:
                 <input name="description" type="text" value={this.state.description} onChange={this.handleFill} />
              </label>
              <p></p>
                Take Picture:
                <Camera storePicture={(uri) => this.storePictureURI(uri)}/>
              <p></p>
              <input type="submit" value="Next"/>
            </form>
          </div>
       : <Loading {...this.state} />

  }
}
