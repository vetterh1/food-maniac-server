import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CameraSnapshot from './CameraSnapshot';

const styles = {
  dialog: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: 'none',
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
    this.onSnapshot = this.onSnapshot.bind(this);

    this.state = {
      open: false,
      picture: null,
    };
  }


  onSnapshot = (data) => {
    console.log('CameraSnapshotContainer.onSnapshot() snapshot length: ', data.length);
    this.handleClose();
    this.props.onSnapshot(data);
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

    return (
      <div>
        <RaisedButton label="Take snapshot" onTouchTap={this.handleOpen} />
        <Dialog
          title="Snapshot"
          actions={actions}
          modal
          contentStyle={styles.dialog}
          open={this.state.open}
        >
          <CameraSnapshot onSnapshot={this.onSnapshot} />
        </Dialog>
      </div>
    );
  }
}