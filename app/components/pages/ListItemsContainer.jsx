/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import * as log from 'loglevel';
import ListItems from './ListItems';

const logListItemsContainer = log.getLogger('logListItemsContainer');
logListItemsContainer.setLevel('debug');
logListItemsContainer.debug('--> entering ListItemsContainer.jsx');

require('es6-promise').polyfill();
require('isomorphic-fetch');



class StatisticsProcessing extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
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




class FullPagination extends React.Component {
  static propTypes = {
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onNumber: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    indexPagination: PropTypes.number.isRequired,
  }

  render() {
    logListItemsContainer.debug(`FullPagination.render: indexPagination=${this.props.indexPagination} count=${this.props.count} itemsPerPage=${this.props.itemsPerPage}`);

    const disabledPrevious = this.props.indexPagination <= 0;
    const disabledNext = this.props.indexPagination > this.props.count - this.props.itemsPerPage;
    const nbPages = Math.floor(((this.props.count - 1) / this.props.itemsPerPage) + 1);
    const activePage = Math.floor((this.props.indexPagination / this.props.itemsPerPage) + 1);

    return (
      <Pagination size="sm">
        <PaginationItem disabled={disabledPrevious} >
          <PaginationLink previous href="#" onClick={() => this.props.onPrevious()} />
        </PaginationItem>
        {Array.apply(null, Array(nbPages)).map((item, i) =>
          <PaginationItem active={activePage === i + 1} key={i}>
            <PaginationLink previous href="#" onClick={() => this.props.onNumber(i * this.props.itemsPerPage)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
         )}
        <PaginationItem disabled={disabledNext} >
          <PaginationLink next href="#" onClick={() => this.props.onNext()} />
        </PaginationItem>
      </Pagination>
    );
  }
}


class BbPagination extends React.Component {
  static propTypes = {
    onNumber: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    indexPagination: PropTypes.number.isRequired,
  }

  render() {
    const disabledPrevious = this.props.indexPagination <= 0;
    const disabledNext = this.props.indexPagination >= this.props.count - this.props.itemsPerPage;
    const nbPages = Math.floor(((this.props.count - 1) / this.props.itemsPerPage) + 1);
    const activePage = Math.floor((this.props.indexPagination / this.props.itemsPerPage) + 1);

    // Full display TRUE ex:   1 2 3 4 5
    // Full display FALSE ex:   1 ... 8 9 10 11 12 ... 20   (here nbBeforeAfterChoice = 2)
    // Full display FALSE ex:   1 ... 7 8 9 10 11 12 13 ... 20   (here nbBeforeAfterChoice = 3)
    const nbBeforeAfterChoice = 2;
    const nbPagesShortDisplay = ((nbBeforeAfterChoice * 2) + 1);
    const fullDisplay = (nbPages <= (nbPagesShortDisplay + 2));
    let offset = fullDisplay ? 0 : (activePage - nbBeforeAfterChoice - 1);
    if (offset < 0) offset = 0;
    const nbPagesToDisplay = fullDisplay ? nbPages : nbPagesShortDisplay;
    if (!fullDisplay && (activePage + nbBeforeAfterChoice) > nbPages) offset = nbPages - nbPagesShortDisplay;

    logListItemsContainer.debug(`BbPagination.render: indexPagination=${this.props.indexPagination} activePage=${activePage} count=${this.props.count} itemsPerPage=${this.props.itemsPerPage} nbPages=${nbPages} nbPagesToDisplay=${nbPagesToDisplay} fullDisplay=${fullDisplay} offset=${offset} `);

    return (
      <Pagination size="sm">
        { !disabledPrevious && <PaginationItem disabled={disabledPrevious} ><PaginationLink previous href="#" onClick={() => this.props.onNumber((activePage - 2) * this.props.itemsPerPage)} /></PaginationItem> }
        { (!fullDisplay && (activePage > nbBeforeAfterChoice + 1)) && <PaginationItem ><PaginationLink href="#" onClick={() => this.props.onNumber(0)}>1</PaginationLink></PaginationItem>}
        { (!fullDisplay && (activePage > nbBeforeAfterChoice + 2)) && <PaginationItem disabled><PaginationLink href="#">...</PaginationLink></PaginationItem>}
        { Array.apply(null, Array(nbPagesToDisplay)).map((item, i) =>
          <PaginationItem active={activePage === i + offset + 1} key={i + offset}>
            <PaginationLink previous href="#" onClick={() => this.props.onNumber((i + offset) * this.props.itemsPerPage)}>
              {i + offset + 1}
            </PaginationLink>
          </PaginationItem>
         )}
        { (!fullDisplay && (activePage < (nbPages - nbBeforeAfterChoice - 1))) && <PaginationItem disabled><PaginationLink href="#">...</PaginationLink></PaginationItem>}
        { (!fullDisplay && (activePage < (nbPages - nbBeforeAfterChoice))) && <PaginationItem><PaginationLink href="#" onClick={() => this.props.onNumber((nbPages - 1) * this.props.itemsPerPage)}>{nbPages}</PaginationLink></PaginationItem>}
        { !disabledNext && <PaginationItem disabled={disabledNext} ><PaginationLink next href="#" onClick={() => this.props.onNumber((activePage) * this.props.itemsPerPage)} /></PaginationItem> }
      </Pagination>
    );
  }
}



class ListItemsContainer extends React.Component {
  static propTypes = {
    // URL that provides the items list. Possible values: ["/api/items", "/util/regenerateAllThumbnails"]
    URL: PropTypes.string.isRequired,
    // Socket name (socket.io-client) that will provide additional items after loading. Possible values: ["/util/regenerateAllThumbnails"]
    socketName: PropTypes.string,
    // Index of the item to fetch. Ex: 5 -> will omit to display the 1st 5 items to start at the 6th
    initialIndexPagination: PropTypes.number,
    // Display a carrousel instead of a list. In this case, the itemsPerPage is NOT used
    carrousel: PropTypes.bool,
    // Display a simple dropdown instead of a list. In this case, the itemsPerPage is NOT used
    dropdown: PropTypes.bool,
    // Nb max of item to fetch. Ex: 10 -> will retreive max 10 items
    itemsPerPage: PropTypes.number,
  };

  static defaultProps = { socketName: null, initialIndexPagination: 0, carrousel: false, dropdown: true, itemsPerPage: 7 };

  constructor(props) {
    super(props);
    this.load = this.load.bind(this);
    // this.next = this.next.bind(this);
    // this.previous = this.previous.bind(this);
    this.updateServerStateById = this.updateServerStateById.bind(this);
    // this._ListItemsComponent = null;

    this.indexPagination = props.initialIndexPagination;

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
      logListItemsContainer.debug(`ListItemsContainer.componentDidMount connects to ${this.props.socketName}`);

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
      logListItemsContainer.debug('added new item: ', itemId);
    }
    this.setState({ items: newItems });
  }


  // next() {
  //   this.indexPagination += this.props.itemsPerPage;
  //   this.load();
  //   logListItemsContainer.debug(`ListItemsContainer - next (new indexPagination=${this.indexPagination})`);
  // }

  // previous() {
  //   this.indexPagination -= this.props.itemsPerPage;
  //   this.load();
  //   logListItemsContainer.debug(`ListItemsContainer - previous (new indexPagination=${this.indexPagination})`);
  // }


  load(imposedIndexPagination = -1) {
    // this._ListItemsComponent.onStartLoading();

    if (imposedIndexPagination !== -1) {
      this.indexPagination = imposedIndexPagination;
    }
    logListItemsContainer.debug(`ListItemsContainer - load (imposedIndexPagination=${imposedIndexPagination}, new indexPagination=${this.indexPagination})`);

    const urlCount = this.props.URL.concat('/count');
    fetch(urlCount)
      .then((response) => {
        logListItemsContainer.debug('ListItemsContainer - fetch count OK');
        return response.json();
      }).then((jsonCount) => {
        if (jsonCount && jsonCount.count) {
          this.setState({ count: jsonCount.count });
        }
      }).catch((ex) => {
        logListItemsContainer.debug('count parsing failed', ex);
      });

    const urlWithParams = this.props.URL.concat('/', this.indexPagination, '/', this.props.itemsPerPage);
    // Add pagination if only if not carrousel
    // let urlWithParams = this.props.URL.concat('/', this.indexPagination);
    // if (!this.props.carrousel) urlWithParams = this.props.URL.concat('/', this.indexPagination, '/', this.props.itemsPerPage);
    logListItemsContainer.debug('ListItemsContainer - fetch:', urlWithParams);
    fetch(urlWithParams)
      .then((response) => {
        logListItemsContainer.debug('ListItemsContainer - fetch operation OK');
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
        logListItemsContainer.debug('parsing failed', ex);
        // this._ListItemsComponent.onEndLoadingFailed(ex);
      });
  }


  render() {
    if (this.state.count === 0 || this.state.items.length === 0) return null;

    return (
      <div>
        <StatisticsProcessing stats={this.state.processingInfo} />
        <div>
          { !this.props.carrousel && this.state.count > this.props.itemsPerPage &&
            <BbPagination
              onNumber={i => this.load(i)}
              count={this.state.count}
              itemsPerPage={this.props.itemsPerPage}
              indexPagination={this.indexPagination}
            />
          }
          <ListItems items={this.state.items} carrousel={this.props.carrousel} dropdown={this.props.dropdown} />
        </div>
      </div>
    );
  }

}

export default ListItemsContainer;
