import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
import CameraSnapshot from './CameraSnapshot';
import IconAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import IconDelete from 'material-ui/svg-icons/action/delete';

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
};


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
    this.onSnapshot = this.onSnapshot.bind(this);
    this.onDeleteSnapshot = this.onDeleteSnapshot.bind(this);

    this.state = {
      open: false,
      snapshot: false,
    };
  }


  onSnapshot = (data) => {
    console.log('CameraSnapshotContainer.onSnapshot() snapshot length: ', data.length);
    this.handleClose();
    this.props.onSnapshot(data);
    this._imageSnapshot.src = data;
    this.setState({ snapshot: true });
  }

  onDeleteSnapshot = () => {
    console.log('CameraSnapshotContainer.onDeleteSnapshot()');
    this.props.onSnapshot(null);
    this._imageSnapshot.src = null;
    this.setState({ snapshot: false });
  }


  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
    ];

    const styleTakeSnapshot = this.state.snapshot ? styles.hidden : styles.visible;
    const styleDeleteSnapshot = this.state.snapshot ? styles.visible : styles.hidden;
//    console.log('render this.state.snapshot, styleTakeSnapshot, styleDeleteSnapshot', this.state.snapshot, styleTakeSnapshot, styleDeleteSnapshot);

    return (
      <div>
        <IconButton style={styleTakeSnapshot} onTouchTap={this.handleOpen}><IconAddAPhoto /></IconButton>
        <IconButton style={styleDeleteSnapshot} onTouchTap={this.onDeleteSnapshot}><IconDelete /></IconButton>

        <Dialog
          title="Snapshot"
          actions={actions}
          modal
          contentStyle={styles.dialog}
          open={this.state.open}
        >
          <CameraSnapshot onSnapshot={this.onSnapshot} />
        </Dialog>
        <img role="presentation" ref={(c) => { this._imageSnapshot = c; }} style={styles.imageSnapshot} />
      </div>
    );
  }
}


//        <canvas ref={(c) => { this._canvasCameraSnapshotContainer = c; }} style={styles.canvas} />
//        <RaisedButton label="Take snapshot" onTouchTap={this.handleOpen} style={styleTakeSnapshot} />
