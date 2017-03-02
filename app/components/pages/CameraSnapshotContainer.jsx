import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import MdAddAPhoto from 'react-icons/lib/md/add-a-photo';
import MdDelete from 'react-icons/lib/md/delete';
import PromiseFileReader from '../utils/PromiseFileReader';

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
  },
};


export default class CameraSnapshotContainer extends React.Component {
  static propTypes = {
    onSnapshotStartProcessing: React.PropTypes.func.isRequired,
    onSnapshotReady: React.PropTypes.func.isRequired,
    onDeleteSnapshot: React.PropTypes.func.isRequired,
    onError: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this._canvasCameraSnapshot = null;
    this._inputSnapshot = null;
    this.onSnapshot = this.onSnapshot.bind(this);
    this.onDeleteSnapshot = this.onDeleteSnapshot.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);

    this.state = {
      snapshot: false,
    };
  }


  //
  // Called when user has take / chose a picture!
  //

  onSnapshot = (event) => {
    // callback fn: tell parent we start processing the snapshot
    this.props.onSnapshotStartProcessing();

    // profiling stats
    this._nowOnSnapshot = new Date().getTime();

    // this is THE file containing the snapshot!
    const file = event.target.files[0];
    console.log('CameraSnapshotContainer.onSnapshot() file: ', file);

    // but we need to read it then update a canvas
    // that will let us get an jpg version :)
    // at last, we update the parent with the jpeg file!
    PromiseFileReader.readAsDataURL(file)
      .then(this.updateCanvas)
      .then(this.updateParent)
      .catch((error) => { this.props.onError(error); this.setState({ snapshot: false }); });

    this.setState({ snapshot: true });
  }

  onDeleteSnapshot = () => {
    console.log('CameraSnapshotContainer.onDeleteSnapshot()');
    this.props.onDeleteSnapshot();
    this.setState({ snapshot: false });
  }


  //
  // Put the raw data in a canvas
  // to reduce its size and get an jpg version :)
  //

  updateCanvas = (rawData) => {
    // profiling stats
    this._nowUpdateCanvas = new Date().getTime();
    const timeDiff = this._nowUpdateCanvas - this._nowOnSnapshot;
    console.log('CameraSnapshotContainer.updateCanvas() rawData length: ', rawData.length);

    // Async process...
    return new Promise((resolve, reject) => {
      // this._canvasCameraSnapshot = this._canvasCameraSnapshot || document.createElement('canvas');

      // Need to put the raw data in an Image 1st
      // as it's the only way to update a canvas with an image
      const image = new Image();
      image.onload = function () {
        // profiling stats
        this._nowOnLoad = new Date().getTime();

        const maxWidth = 1500;
        const maxHeight = 1500;
        console.log('CameraSnapshotContainer.updateCanvas() in onload');
        this._canvasCameraSnapshot.width = image.width;
        this._canvasCameraSnapshot.height = image.height;
        const ratio = image.width / image.height;
        // Reduce width if necessary
        if (this._canvasCameraSnapshot.width > maxWidth) {
          this._canvasCameraSnapshot.width = maxWidth;
          this._canvasCameraSnapshot.height = maxWidth / ratio;
        }
        // Reduce height if necessary
        if (this._canvasCameraSnapshot.height > maxHeight) {
          this._canvasCameraSnapshot.height = maxHeight;
          this._canvasCameraSnapshot.width = maxHeight * ratio;
        }
        console.log(`updateCanvas() - image: (${image.width}x${image.height}) - ratio=${ratio} - final: (${this._canvasCameraSnapshot.width}x${this._canvasCameraSnapshot.height}) with ratio: ${this._canvasCameraSnapshot.width / this._canvasCameraSnapshot.height}`);
        try {
          this._canvasCameraSnapshot.getContext('2d').drawImage(image, 0, 0, this._canvasCameraSnapshot.width, this._canvasCameraSnapshot.height);
          const dataSnapshot = this._canvasCameraSnapshot.toDataURL('image/jpeg', 0.8);
          resolve(dataSnapshot);  // returns jpeg smaller data to parent instead of bigger raw data
        } catch (e) {
          reject('Drawing image failed');
        }
      }.bind(this);
      image.onerror = () => { reject('Loading image failed'); };
      image.src = rawData;
    });
  }


  //
  // Once the raw data has been put in a canvas,
  // reduced & transformed in jpeg,
  // then we update the parent with a mandatory props callback function
  //

  updateParent = (finalData) => {
    // profiling stats
    this._nowUpdateParent = new Date().getTime();
    // const timeDiff = this._nowUpdateParent - this._nowOnLoad;
    console.log('CameraSnapshotContainer.updateCanvas() finalData length: ', finalData.length);

    // Callback fn: send data back to parent
    this.props.onSnapshotReady(finalData, this._nowUpdateParent);
  }


  render() {
    const styleTakeSnapshot = Object.assign({}, styles.snapshotInputBlock, this.state.snapshot ? styles.hidden : styles.visible);
    const styleDeleteSnapshot = this.state.snapshot ? styles.visible : styles.hidden;

    return (
      <div>
        <div style={styleTakeSnapshot}>
          <div style={styles.snapshotButton}><MdAddAPhoto size={36} /></div>
          <input type="file" ref={(r) => { this._inputSnapshot = r; }} style={styles.snapshotInput} onChange={this.onSnapshot} accept="image/*" capture />
        </div>
        <Row>
          <Col sm="12" md={{ size: 8, offset: 2 }}><canvas ref={(c) => { this._canvasCameraSnapshot = c; }} style={styles.canvas} /></Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 8, offset: 2 }}><Button style={styleDeleteSnapshot} onTouchTap={this.onDeleteSnapshot}>----> <MdDelete size={28} /></Button></Col>
        </Row>
      </div>
    );
  }
}
