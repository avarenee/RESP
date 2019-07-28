import React, {Component} from 'react';
import camera from '../assets/camera.jpg';

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: undefined,
    };
    this.getCamera = this.getCamera.bind(this);
    this.getPicture = this.getPicture.bind(this);
    this.tryAgain = this.tryAgain.bind(this);
    this.confirmPicture = this.confirmPicture.bind(this);
  }
  componentDidMount() {
    this.video = document.querySelector('.camera');
  }
  getCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(localMediaStream => {
        this.video.srcObject = localMediaStream;
        this.video.play();
        this.setState({buttons : <button type="button" onClick={this.getPicture}>Take Picture</button>});
      })
      .catch(err => {
        console.error(`Error with getting media:`, err);
      });
  }
  tryAgain() {
    this.video.play();
    this.setState({buttons : <button type="button" onClick={this.getPicture}>Take Picture</button>});
  }
  confirmPicture() {
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.drawImage(this.video, 0, 0, width, height);
    const dataURL = this.canvas.toDataURL('image/jpeg');
    this.video.srcObject.getTracks()[0].stop();
    this.setState({buttons : null});
    this.props.storePicture(dataURL);
  }
  getPicture() {
    this.video.pause();
    this.setState({buttons: <div>
                              <button type="button" onClick={this.confirmPicture}>Confirm Picture</button>
                              <button type="button" onClick={this.tryAgain}>Try Again</button>
                            </div>});
  }
  render() {
    return(
      <div className="containercamera">
        <video className="camera" poster={camera} onClick={this.getCamera}></video>
        <p></p>
        {this.state.buttons}
      </div>
    );
  }
}
