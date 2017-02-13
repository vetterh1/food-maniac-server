import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
  serverUnknown: {
    // color: 'grey',
  },
  serverOK: {
    color: 'green',
  },
  serverKO: {
    color: 'red',
  },
  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
  },
};


class ItemImage extends React.Component {

  static propTypes = {
    id: React.PropTypes.string,
  }

  render() {
    if (!this.props.id) return null;
    const srcUrl = `/static/thumbnails/${this.props.id}.jpg`;
    return (<img src={srcUrl} role="presentation" />);
  }
}



class ListOneItem extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    item: React.PropTypes.object.isRequired,
  }

  render() {
    let styleGivenByServer = styles.serverUnknown;
    if (this.props.item.serverState === 'OK') styleGivenByServer = styles.serverOK;
    if (this.props.item.serverState === 'KO') styleGivenByServer = styles.serverKO;
    return (<li style={styleGivenByServer}>{this.props.item.name} <ItemImage id={this.props.item.picture} /></li>);
  }
}



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
    this._nowStartLoading = new Date().getTime();
    this.setState({ snackbarOpen: true, snackbarMessage: 'Loading...', snackbarTimeout: 60000 });
  }

  onEndLoadingOK() {
    const durationLoading = new Date().getTime() - this._nowStartLoading;
    this.setState({ snackbarOpen: true, snackbarMessage: `Loading items completed! (duration=${durationLoading}ms)`, snackbarTimeout: 10000 });
  }

  onEndLoadingFailed(errorMessage) {
    const durationSaving = new Date().getTime() - this._nowStartLoading;
    this.setState({ snackbarOpen: true, snackbarMessage: `Error while loading items (error=${errorMessage}, duration=${durationSaving}ms)`, snackbarTimeout: 10000 });
  }

  render() {
    // console.log('props.item: ', this.props.items);
    return (
      <MuiThemeProvider muiTheme={this.context.muiTheme}>
        <div style={styles.paperStyle}>
          <h1>Items list</h1>
          <ul>
            {this.props.items.map((item, index) => (
              <ListOneItem index={index} item={item} key={item._id} />
            ))}
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
