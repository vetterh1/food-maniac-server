import React from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import IconDelete from 'material-ui/svg-icons/action/delete';
import LogOnDisplay from '../utils/LogOnDisplay';

const styles = {
  dialog: {
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
};


function displayAsImage(file) {
  var imgURL = URL.createObjectURL(file),
      img = document.createElement('img');

  img.onload = function() {
    URL.revokeObjectURL(imgURL);
  };

  img.src = imgURL;
  document.body.appendChild(img);
}


/**
 * The dialog width has been set to occupy the full width of browser through the `contentStyle` property.
 */
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
    this._logOnDisplay = null;

    this.state = {
      snapshot: false,
    };
  }


  onSnapshot = (event) => {
    const file = event.target.files[0];
    console.log('CameraSnapshotContainer.onSnapshot() file: ', file);
    displayAsImage(file);

//    this.props.onSnapshot(data);
//    this._imageSnapshot.src = data;
    this.setState({ snapshot: true });
  }

  onDeleteSnapshot = () => {
    console.log('CameraSnapshotContainer.onDeleteSnapshot()');
    this.props.onSnapshot(null);
    this._imageSnapshot.src = null;
    this.setState({ snapshot: false });
  }

  render() {
    const styleTakeSnapshot = this.state.snapshot ? styles.hidden : styles.visible;
    const styleDeleteSnapshot = this.state.snapshot ? styles.visible : styles.hidden;

    return (
      <div>
        <IconButton style={styleDeleteSnapshot} onTouchTap={this.onDeleteSnapshot}><IconDelete /></IconButton>
        <div style={styles.snapshotInputBlock}>
          <div style={styles.snapshotButton}><IconAddAPhoto /></div>
          <input type="file" ref={(r) => { this._inputSnapshot = r; }} style={styles.snapshotInput} onChange={this.onSnapshot} accept="image/*" capture />
        </div>
        <img role="presentation" ref={(c) => { this._imageSnapshot = c; }} style={styles.imageSnapshot} />
        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
      </div>
    );
  }
}

/*
        <IconButton style={styleTakeSnapshot} onTouchTap={this.handleOpen}><IconAddAPhoto /></IconButton>
        <Dialog
          title="Snapshot"
          actions={actions}
          modal
          contentStyle={styles.dialog}
          open={this.state.open}
        >
          <CameraSnapshot onSnapshot={this.onSnapshot} />
        </Dialog>
*/
//        <input type="file" name="image" accept="image/*" capture />
//        <canvas ref={(c) => { this._canvasCameraSnapshotContainer = c; }} style={styles.canvas} />
//        <RaisedButton label="Take snapshot" onTouchTap={this.handleOpen} style={styleTakeSnapshot} />
