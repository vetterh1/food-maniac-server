import React from 'react';
import IconButton from 'material-ui/IconButton';
// import FlatButton from 'material-ui/FlatButton';
import IconAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import IconDelete from 'material-ui/svg-icons/action/delete';
import PromiseFileReader from '../utils/PromiseFileReader';
import LogOnDisplay from '../utils/LogOnDisplay';

const styles = {
  hidden: {
    visibility: 'hidden',
  },
  visible: {
    visibility: 'visible',
  },
  // snapshotInputBlock: {
  //   display: 'block',
  //   width: '100px',
  //   height: '20px',
  //   overflow: 'hidden',
  // },

  snapshotButton: {
    width: '110px',
    height: '30px',
    position: 'relative',
    top: '-5px',
    left: '-5px',
  },

  snapshotInput: {
    fontSize: '50px',
    width: '120px',
    opacity: 0,
    filter: 'alpha(opacity=0)',
    position: 'relative',
    top: '-40px',
    left: '-20px',
  },

  canvas: {
    width: 0,
    height: 0,
  }
};


export default class CameraSnapshotContainer extends React.Component {
  static propTypes = {
    onSnapshot: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this._canvasCameraSnapshot = null;
    this._inputSnapshot= null;
    this.onSnapshot = this.onSnapshot.bind(this);
    this.onDeleteSnapshot = this.onDeleteSnapshot.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this._logOnDisplay = null;

    this.state = {
      snapshot: false,
    };
  }


  updateParent = (finalData) => {
    console.log('CameraSnapshotContainer.updateCanvas() finalData length: ', finalData.length);
    this._logOnDisplay.addLog(`updateCanvas() - finalData.length=${finalData.length}`);

    this.props.onSnapshot(finalData);   // callback fn: send data back to parent
  }



  updateCanvas = (rawData) => {
    console.log('CameraSnapshotContainer.updateCanvas() rawData length: ', rawData.length);
    this._logOnDisplay.addLog(`updateCanvas() - rawData.length=${rawData.length}`);
    return new Promise((resolve, reject) => {
      this._canvasCameraSnapshot = this._canvasCameraSnapshot || document.createElement('canvas');
      const image = new Image();
      image.onload = function () {
        const maxWidth = 1024;
        const maxHeight = 1024;
        console.log('CameraSnapshotContainer.updateCanvas() in onload');
        this._canvasCameraSnapshot.width = image.width > maxWidth ? maxWidth : image.width;
        this._canvasCameraSnapshot.height = image.height > maxHeight ? maxHeight : image.height;
        this._logOnDisplay.addLog(`updateCanvas() - image.width=${image.width}`);
        this._canvasCameraSnapshot.getContext('2d').drawImage(image, 0, 0, this._canvasCameraSnapshot.width, this._canvasCameraSnapshot.height);
        const dataSnapshot = this._canvasCameraSnapshot.toDataURL('image/jpeg', 0.7);
        resolve(dataSnapshot);  // returns jpeg smaller data to parent instead of bigger raw data
      }.bind(this);
      image.src = rawData;
    });
  }


  onSnapshot = (event) => {
    const file = event.target.files[0];
    console.log('CameraSnapshotContainer.onSnapshot() file: ', file);

    PromiseFileReader.readAsDataURL(file)
      .then(this.updateCanvas)
      .then(this.updateParent);

    this.setState({ snapshot: true });
  }

  onDeleteSnapshot = () => {
    console.log('CameraSnapshotContainer.onDeleteSnapshot()');
    this.props.onSnapshot(null);
    this.setState({ snapshot: false });
  }

  render() {
    const styleTakeSnapshot = Object.assign( {}, styles.snapshotInputBlock, this.state.snapshot ? styles.hidden : styles.visible );
    const styleDeleteSnapshot = this.state.snapshot ? styles.visible : styles.hidden;

    return (
      <div>
        <IconButton style={styleDeleteSnapshot} onTouchTap={this.onDeleteSnapshot}><IconDelete /></IconButton>
        <div style={styleTakeSnapshot}>
          <div style={styles.snapshotButton}><IconAddAPhoto /></div>
          <input type="file" ref={(r) => { this._inputSnapshot = r; }} style={styles.snapshotInput} onChange={this.onSnapshot} accept="image/*" capture />
        </div>
        <canvas ref={(c) => { this._canvasCameraSnapshot = c; }} style={styles.canvas} />
        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
      </div>
    );
  }
}
