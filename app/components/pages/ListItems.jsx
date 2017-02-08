import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';


const styles = {
  paperStyle: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  submitStyle: {
    marginTop: 32,
  },
  form_content: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  form_buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  item: {
    padding: '0.5em',
    marginRight: 32,
  },

  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
  },
};

class ListItems extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
  }

  constructor() {
    super();

    this.state = {
      snackbarOpen: false,
      snackbarMessage: '.',
      snackbarTimeout: 4000,
    };
  }


  onStartLoading() {
    this._nowStartSaving = new Date().getTime();
    this.setState({ snackbarOpen: true, snackbarMessage: 'Loading...', snackbarTimeout: 60000 });
  }

  onEndLoadingOK() {
    const durationLoading = new Date().getTime() - this._nowStartSaving;
    this.setState({ snackbarOpen: true, snackbarMessage: `Loading items completed! (duration=${durationLoading}ms)`, snackbarTimeout: 4000 });
  }

  onEndLoadingFailed(errorMessage) {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ snackbarOpen: true, snackbarMessage: `Error while loading items (error=${errorMessage}, duration=${durationSaving}ms)`, snackbarTimeout: 10000 });
  }

  render() {
    console.log('props.item: ', this.props.items);
    return (
      <MuiThemeProvider muiTheme={this.context.muiTheme}>
        <div style={styles.paperStyle}>
          <h1>Items list</h1>
          <ul>
            {this.props.items.map((item, index) => (<li key={index}>{item.name}</li>))}
          </ul>
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            autoHideDuration={this.state.snackbarTimeout}
          />
        </div>
      </MuiThemeProvider>
    );
  }

}

export default ListItems;
