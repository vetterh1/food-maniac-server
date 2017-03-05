import React from 'react';
import ListItems from './ListItems';
import io from 'socket.io-client';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

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
    // URL that provides the items list. Possible values: ["/api/items", "/util/regenerateAllThumbnails"]
    URL: React.PropTypes.string.isRequired,
    // Socket name (socket.io-client) that will provide additional items after loading. Possible values: ["/util/regenerateAllThumbnails"]
    socketName: React.PropTypes.string,
    // Index of the item to fetch. Ex: 5 -> will omit to display the 1st 5 items to start at the 6th
    indexPagination: React.PropTypes.number,
    // Nb max of item to fetch. Ex: 10 -> will retreive max 10 items
    itemsPerPage: React.PropTypes.number,
  };

  static defaultProps = { itemsPerPage: 7, indexPagination: 0 };

  constructor(props) {
    super(props);
    this.load = this.load.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.updateServerStateById = this.updateServerStateById.bind(this);
    // this._ListItemsComponent = null;

    this.indexPagination = props.indexPagination;

    this.state = {
      items: [],
      count: 0,
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


  next() {
    this.indexPagination += this.props.itemsPerPage;
    this.load();
    console.log('ListItemsContainer - next');
  }

  previous() {
    this.indexPagination -= this.props.itemsPerPage;
    this.load();
    console.log('ListItemsContainer - previous');
  }


  load(imposedIndexPagination = -1) {
    // this._ListItemsComponent.onStartLoading();

    if (imposedIndexPagination !== -1) {
      this.indexPagination = imposedIndexPagination
    }

    const urlCount = this.props.URL.concat('/count' );
    fetch(urlCount)
      .then((response) => {
        console.log('ListItemsContainer - fetch count OK');
        return response.json();
      }).then((jsonCount) => {
        if (jsonCount && jsonCount.count) {
          this.setState({ count: jsonCount.count });
        }
      }).catch((ex) => {
        console.log('count parsing failed', ex);
      });
    
    const urlWithParams = this.props.URL.concat('/', this.indexPagination, '/', this.props.itemsPerPage );
    console.log('ListItemsContainer - fetch:', urlWithParams);
    fetch(urlWithParams)
      .then((response) => {
        console.log('ListItemsContainer - fetch operation OK');
        return response.json();
      }).then((jsonItems) => {
        if (jsonItems && jsonItems.items && jsonItems.items.length > 0) {
          this.setState({ items: jsonItems.items });
          // this._ListItemsComponent.onEndLoadingOK();
        }
        if (jsonItems && jsonItems.error) {
          // this._ListItemsComponent.onEndLoadingFailed(jsonItems.error);
        }
      }).catch((ex) => {
        console.log('parsing failed', ex);
        // this._ListItemsComponent.onEndLoadingFailed(ex);
      });
  }


  render() {
    if( this.state.count === 0 || this.state.items.length === 0) return null;

    console.log(`ListItemsContainer.render: indexPagination=${this.indexPagination}`);
    const disabledPrevious = this.indexPagination <= 0;
    const disabledNext = this.indexPagination > this.state.count - this.props.itemsPerPage;
    const nbPages = Math.floor(((this.state.count - 1) / this.props.itemsPerPage) + 1);
    const activePage = Math.floor((this.indexPagination  / this.props.itemsPerPage) + 1);

    return (
      <div>
        <StatisticsProcessing stats={this.state.processingInfo} />
        <div>
          { this.state.count > this.props.itemsPerPage && 
            <Pagination size="sm">
              <PaginationItem disabled={disabledPrevious} >
                <PaginationLink previous href="#" onClick={() => this.previous()} />
              </PaginationItem>
              {Array.apply(null, Array(nbPages)).map((item, i) =>
                 <PaginationItem active={activePage === i+1}>
                  <PaginationLink previous href="#" onClick={() => this.load(i * this.props.itemsPerPage)}>
                  {i+1}
                  </PaginationLink>
                </PaginationItem>
               )}
              <PaginationItem disabled={disabledNext} >
                <PaginationLink next href="#" onClick={() => this.next()} />
              </PaginationItem>
            </Pagination>
          }
          <ListItems items={this.state.items} />
        </div>
      </div>
    );
  }

}

export default ListItemsContainer;

//          <ListItems ref={(r) => { this._ListItemsComponent = r; }} items={this.state.items} />
