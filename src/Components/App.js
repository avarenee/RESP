import React, { Component, Fragment } from "react";
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
import 'file-loader';
import camera from './camera.jpg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      picture_status: undefined,
      owner_id: undefined,
      first: undefined,
      last: undefined,
      mi: undefined,
      dob: undefined,
      sex: undefined,
      height: undefined,
      weight: undefined,
      campsite: undefined,
      description: undefined,
      picture: undefined,
    };
    this.handleFill = this.handleFill.bind(this);
    this.pictureControl = this.pictureControl.bind(this);
    this.getVideo = this.getVideo.bind(this);
    this.getPicture = this.getPicture.bind(this);
    this.confirmPicture = this.confirmPicture.bind(this);
    this.addFound = this.addFound.bind(this);
  }

  componentDidMount() {
    this.client = Stitch.initializeDefaultAppClient("resp-nqkab");
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("sample_disaster");
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
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
        campsite: this.state.campsite,
        description: this.state.description,
        picture: this.state.picture
      })
      .then(this.displayFound)
      .catch(console.error);
  }
  handleFill(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name] : value});
  }
  pictureControl(status) {
    switch(status) {
      case "camera opened":
        return <button type="button" onClick={this.getPicture}>Take Picture</button>
      case "picture taken":
        return <Fragment>
                 <button type="button" onClick={this.confirmPicture}>Confirm Picture</button>
                 <button type="button" onClick={this.getVideo}>Try Again</button>
               </Fragment>
      default:
        return <img src={camera} onClick={this.getVideo}/>
    }
  }
  getVideo() {
  this.setState({picture_status : "camera opened"});
  this.video = document.querySelector('.player');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
    .then(localMediaStream => {
      this.video.srcObject = localMediaStream;
      this.video.play();
    })
    .catch(err => {
      console.error(`Error with getting media:`, err);
    });
  }
  getPicture() {
    this.video.pause();
    this.video.srcObject.getTracks()[0].stop();
    this.canvas = document.createElement("canvas");
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.left = this.video.offsetLeft + "px";
    this.canvas.style.top = this.video.offsetTop + "px";
    var ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, width, height);
    this.setState({picture_status : "picture taken"});
  }
  confirmPicture() {
    const dataURL = this.canvas.toDataURL('image/jpeg');
    this.setState({picture : dataURL});
  }
  render() {
    return (
      <div>
        <h3>CheckIn</h3>
        <form id='checkin' onSubmit={this.addFound}>
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
            Campsite:
             <input name="campsite" type="text" value={this.state.campsite} onChange={this.handleFill} />
          </label>
          <p></p>
          <label>
            Description:
             <input name="description" type="text" value={this.state.description} onChange={this.handleFill} />
          </label>
          <p></p>
          <video className="player" ></video>
          {this.pictureControl(this.state.picture_status)}
          <p></p>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

export default App;
