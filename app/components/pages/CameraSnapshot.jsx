import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconCamera from 'material-ui/svg-icons/image/photo-camera';
import IconCameraSwitch from 'material-ui/svg-icons/image/switch-camera';

const styles = {
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  video: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: 'none',
  },
  canvas: {
    // visibility: 'hidden',
  },
};


export default class CameraSnaphotContainer extends React.Component {
  static propTypes = {
    onSnapshot: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();

    // Picture
    this.hasGetUserMedia = this.hasGetUserMedia.bind(this);
    this.successVideoCallback = this.successVideoCallback.bind(this);
    this.errorVideoCallback = this.errorVideoCallback.bind(this);
    this.handleTakeSnapshot = this.handleTakeSnapshot.bind(this);
    this.handleSwitchCamera = this.handleSwitchCamera.bind(this);
    this.stopMediaStream = this.stopMediaStream.bind(this);
    this._video = null;
    this._stream = null;
    this._canvasCameraSnapshot = null;

    this.state = {
      video: false,
    };
  }

  componentDidMount() {
    if (!this.hasGetUserMedia()) {
      alert('getUserMedia() is not supported in your browser');
    } else {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      this._video = document.querySelector('video');
      console.log('this._video: ', this._video);
      navigator.getUserMedia({ audio: false, video: true }, this.successVideoCallback, this.errorVideoCallback);
      // navigator.getUserMedia is deprecated. should use navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(this.successVideoCallback).catch(this.errorVideoCallback);
    }
  }

  componentWillUnmount() {
    this.stopMediaStream();
  }

  stopMediaStream() {
    if (this._video) {
      this._video.pause();
      this._video.src = '';
    }
    if (this._stream) {
      console.log('CameraSnaphotContainer.stopMediaStream() nb tracks to stop: ', this._stream.getTracks().length);
      this._stream.getTracks().forEach((track) => { track.stop(); });
    }
  }


  hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  successVideoCallback(stream) {
    this._stream = stream; 
    if (window.URL) {
      this._video.src = window.URL.createObjectURL(stream);
    } else {
      this._video.src = stream;
    }
    this.setState({ video: true });
  }

  errorVideoCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  handleTakeSnapshot = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this._canvasCameraSnapshot = this._canvasCameraSnapshot || document.createElement('canvas');

    // const canvas = window.canvas = document.querySelector('canvas');
    this._canvasCameraSnapshot.width = this._video.videoWidth;
    this._canvasCameraSnapshot.height = this._video.videoHeight;
    this._canvasCameraSnapshot.getContext('2d').drawImage(this._video, 0, 0, this._canvasCameraSnapshot.width, this._canvasCameraSnapshot.height);

    const dataSnapshot = this._canvasCameraSnapshot.toDataURL('image/jpeg', 0.9);
    console.log('CameraSnaphot.handleTakeSnapshot() snapshot length: ', dataSnapshot.length);

    this.props.onSnapshot(dataSnapshot); // callback fn: send data back to container
  }

  handleSwitchCamera = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    // see example here: https://webrtc.github.io/samples/src/content/devices/input-output/
  }

  render() {
    return (
      <div style={styles.main}>
        <div>
          <IconButton
            style={styles.cameraIconStyle}
            disabled={!this.state.video}
            onTouchTap={this.handleTakeSnapshot}
          >
            <IconCamera color="rgb(0, 188, 212)" />
          </IconButton>
          <IconButton
            style={styles.cameraIconSwitchStyle}
            disabled={!this.state.video}
            onTouchTap={this.handleTakeSnapshot}
          >
            <IconCameraSwitch color="rgb(0, 188, 212)" />
          </IconButton>
        </div>
        <video autoPlay style={styles.video} />
      </div>
    );
  }
}


/*           <canvas ref={(c) => { this._canvasCameraSnapshot = c; }} style={styles.canvas} />
*/