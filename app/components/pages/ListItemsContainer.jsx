import React from 'react';
import ListItems from './ListItems';
import io from 'socket.io-client';

require('es6-promise').polyfill();
require('isomorphic-fetch');



class StatisticsProcessing extends React.Component {
  static propTypes = {
    stats: React.PropTypes.object.isRequired,
  }

  render() {
    if (this.props.stats.durationTotal <= 0) return null;
    return (
      <ul>
        <li>Status: {this.props.stats.status}</li>
        <li>Total duration: {Math.round(this.props.stats.durationTotal / 1000)} seconds</li>
        <li>Avg duration / item: {Math.round(this.props.stats.durationTotal / (this.props.stats.nbFilesOK + 1))} ms</li>
        <li>Duration last item: {this.props.stats.duration} ms</li>
        <li>Nb files OK: {this.props.stats.nbFilesOK}</li>
        <li>Nb files KO: {this.props.stats.nbFilesKO}</li>
      </ul>
    );
  }
}



class ListItemsContainer extends React.Component {
  static propTypes = {
    URL: React.PropTypes.string.isRequired,
    socketName: React.PropTypes.string,
    pagination: React.PropTypes.string,
  }

  constructor() {
    super();
    this.load = this.load.bind(this);
    this.updateServerStateById = this.updateServerStateById.bind(this);
    this._ListItemsComponent = null;

    this.state = {
      items: [],
      processingInfo: {
        status: '? (might be running)',
        duration: 0,
        durationTotal: 0,
        nbFilesOK: 0,
        nbFilesKO: 0,
      },
    };
  }

  componentDidMount() {
    if (this.props.socketName) {
      console.log(`ListItemsContainer.componentDidMount connects to ${this.props.socketName}`);

      this.socket = io();

      // Callback from server: processing starts
      this.socket.on(`${this.props.socketName}.start`, () => {
        this.setState({ processingInfo: { ...this.state.processingInfo, status: 'ON' } });
      });

      // Callback from server: a file has been successfully processed
      this.socket.on(`${this.props.socketName}.OK`, (paramObject) => {
        this.setState({ processingInfo: { ...this.state.processingInfo, ...paramObject } });
        this.updateServerStateById(paramObject.fileName, 'OK', paramObject.fileName);
      });

      // Callback from server: a file has been processed with errors
      this.socket.on(`${this.props.socketName}.KO`, (paramObject) => {
        this.setState({ processingInfo: { ...this.state.processingInfo, ...paramObject } });
        this.updateServerStateById(paramObject.fileName, 'KO');
      });

      // Callback from server: processing is done
      this.socket.on(`${this.props.socketName}.done`, (paramObject) => {
        this.setState({ processingInfo: { ...this.state.processingInfo, status: 'OFF', ...paramObject } });
      });
    }

    this.load();
  }

  componentWillUnmount() {
  }


  updateServerStateById(itemId, value) {
    let found = false;
    const newItems = this.state.items.map((item) => {
      if (item._id === itemId) {
        found = true;
        return { ...item, serverState: value };
      }
      return item;
    });
    if (!found) {
      newItems.push({ name: itemId, _id: itemId, serverState: value });
      console.log('added new item: ', itemId);
    }
    this.setState({ items: newItems });
  }



  load() {
    this._ListItemsComponent.onStartLoading();
    const urlWithParams = this.props.URL.concat('/', this.props.pagination );

    fetch(urlWithParams)
      .then((response) => {
        console.log('ListItemsContainer - fetch operation OK');
        return response.json();
      }).then((jsonItems) => {
        // console.log('parsed json: ', jsonItems);
        if (jsonItems && jsonItems.items && jsonItems.items.length > 0) {
          this.setState({ items: jsonItems.items });
          this._ListItemsComponent.onEndLoadingOK();
        }
        if (jsonItems && jsonItems.error) {
          this._ListItemsComponent.onEndLoadingFailed(jsonItems.error);
        }
      }).catch((ex) => {
        console.log('parsing failed', ex);
        this._ListItemsComponent.onEndLoadingFailed(ex);
      });
  }


  render() {
    return (
      <div>
        <StatisticsProcessing stats={this.state.processingInfo} />
        <div>
          <ListItems ref={(r) => { this._ListItemsComponent = r; }} items={this.state.items} />
        </div>
      </div>
    );
  }

}

export default ListItemsContainer;
