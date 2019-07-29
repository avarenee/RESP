import React, {Component} from 'react';
import camera from '../assets/camera.jpg';
import styled from 'styled-components';

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
    this.video = document.querySelector('#camera');
  }
  getCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(localMediaStream => {
        this.video.srcObject = localMediaStream;
        this.video.play();
        this.setState({buttons : <Button style={{backgroundColor: "#160f6f"}} onClick={this.getPicture}>Take Picture</Button>});
      })
      .catch(err => {
        console.error(`Error with getting media:`, err);
      });
  }
  tryAgain() {
    this.video.play();
    this.setState({buttons : <Button style={{backgroundColor: "#160f6f"}} onClick={this.getPicture}>Take Picture</Button>});
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
                              <Button style={{backgroundColor: "#160f6f"}} onClick={this.confirmPicture}>Confirm</Button>
                              <Button style={{backgroundColor: "tomato"}} onClick={this.tryAgain}>Try Again</Button>
                            </div>});
  }
  render() {
    return(
      <Div>
        <Video id="camera" poster={camera} onClick={this.getCamera}></Video>
        {this.state.buttons}
      </Div>
    );
  }
}

const Div = styled.div`
  width: 240px;
  margin: default;
  float: right;
  text-align: center;
  display: inline-block;
`;

const Button = styled.button`
  border: none;
  color: white;
  max-width: 240px;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 16px;
  margin-top: -40px;
  margin-left: 10px;
  margin-right: 10px;
`;

const Video = styled.video`
  width: 240px;
  height: 240px;
`;
