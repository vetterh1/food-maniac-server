import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconCamera from 'material-ui/svg-icons/image/photo-camera';
import IconCameraSwitch from 'material-ui/svg-icons/image/switch-camera';
import LogOnDisplay from '../utils/LogOnDisplay';

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
  hidden: {
    visibility: 'hidden',
  },
  visible: {
    visibility: 'visible',
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
    this.initVideo = this.initVideo.bind(this);
    this.successVideoCallback = this.successVideoCallback.bind(this);
    this.errorVideoCallback = this.errorVideoCallback.bind(this);
    this.handleTakeSnapshot = this.handleTakeSnapshot.bind(this);
    this.handleSwitchCamera = this.handleSwitchCamera.bind(this);
    this.stopMediaStream = this.stopMediaStream.bind(this);
    this.gotSources = this.gotSources.bind(this);
    this._video = null;
    this._stream = null;
    this._canvasCameraSnapshot = null;
    this._sources = [];
    this._indexSources = 0;
    this._logOnDisplay = null;

    this.state = {
      video: false,
    };
  }

  componentDidMount() {
    MediaStreamTrack.getSources(this.gotSources);
    this.initVideo();
  }


  initVideo() {
    if (!this.hasGetUserMedia()) {
      alert('getUserMedia() is not supported in your browser');
    } else {
      const videoConstraints = { 
        audio: false, 
        video: {
          optional: [{
            sourceId: this._sources[this._indexSources]
          }]
        }
      };

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      this._video = document.querySelector('video');
      console.log('this._video: ', this._video);
      navigator.getUserMedia(videoConstraints, this.successVideoCallback, this.errorVideoCallback);
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


  gotSources(sourceInfos) {
    sourceInfos.forEach((source, index) => {
      if (source.kind === 'video'){
        this._sources.push(source.label);
      }
    });
    this._indexSources = 0;
    console.log('CameraSnaphot.gotSources() sources: ', this._sources);
    this._logOnDisplay.addLog(`gotSources() - sources.length=${this._sources.length}`);
    this._sources.forEach((source, index) => { this._logOnDisplay.addLog(`gotSources() - sources ${index}=${source}`); });
  }


  handleSwitchCamera = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this._indexSources++;
    if (this._indexSources >= this._sources.length) this._indexSources = 0;
    console.log('CameraSnaphot.handleSwitchCamera() _indexSources,_sources : ', this._indexSources, this._sources);
    this._logOnDisplay.addLog(`sources.length=${this._sources.length}`);
    this._logOnDisplay.addLog(`index sources=${this._indexSources}`);
    this._indexSources.forEach((source) => { this._logOnDisplay.addLog(`source: ${source}`); });
    this.initVideo();
    // see example here: https://webrtc.github.io/samples/src/content/devices/input-output/
  }



  render() {
    const switchStyle = this._sources.length > 1 ? styles.visible : styles.hidden;

    return (
      <div style={styles.main}>
        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
        <div>
          <IconButton
            style={styles.cameraIconStyle}
            disabled={!this.state.video}
            onTouchTap={this.handleTakeSnapshot}
          >
            <IconCamera color="rgb(0, 188, 212)" />
          </IconButton>
          <IconButton
            style={switchStyle}
            disabled={!this.state.video}
            onTouchTap={this.handleSwitchCamera}
          >
            <IconCameraSwitch color="rgb(0, 188, 212)" />
          </IconButton>
        </div>
        <video autoPlay style={styles.video} onTouchTap={this.handleTakeSnapshot} />
      </div>
    );
  }
}


/*           <canvas ref={(c) => { this._canvasCameraSnapshot = c; }} style={styles.canvas} />
*/