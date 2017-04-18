/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */

import React from 'react';
import { connect } from 'react-redux';
import ListItemsContainer from '../pages/ListItemsContainer';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class RecentItems extends React.Component {
  static propTypes = {
    // items: React.PropTypes.array.isRequired,
  }

  constructor() {
    super();

    this.state = {
      open: false,
    };
  }


  render = () => {
    return (
      <ListItemsContainer URL="/api/items" pagination="5" />
    );
  }
/*

  render = () => {
    return (
      <GridList
        cellHeight={180}
        style={styles.gridList}
      >
        {this.props.items.map((item) => {
          let imgSrc = `/static/pictures/items/${item.picture}.jpg`;
          // if (!item.picture) imgSrc = '/static/pictures/misc/unknownItem.jpg';
          if (!item.picture) imgSrc = 'images/star_pizza_600.jpg';
          return (
            <GridTile
              key={item._id}
              title={item.name}
              actionIcon={<IconButton><IconStarBorder color="rgb(0, 188, 212)" /></IconButton>}
              titleStyle={styles.titleStyle}
              titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
            >
              <img src={imgSrc} role="presentation" />
            </GridTile>
          );
        })}
      </GridList>
    );
  }
*/
}


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

RecentItems = connect(mapStateToProps)(RecentItems); // eslint-disable-line no-class-assign
// export default RecentItems;





class RecentItemsContainer extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.load = this.load.bind(this);
    this._RecentItemsComponent = null;

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    this.load();
  }

  load() {
    fetch('/api/items')
      .then((response) => {
        console.log('fetch operation OK', response.statusText);
        return response.json();
      }).then((jsonItems) => {
        console.log('parsed json: ', jsonItems);
        this.setState({ items: jsonItems.items });
        // this._RecentItemsComponent.onEndLoadingOK();
      }).catch((ex) => {
        console.log('parsing failed', ex);
        // this._RecentItemsComponent.onEndLoadingFailed();
      });
  }

  render() {
    return (<RecentItems ref={(r) => { this._RecentItemsComponent = r; }} />);
  }
//     return (<RecentItems ref={(r) => { this._RecentItemsComponent = r; }} items={this.state.items} />);

}

export default RecentItemsContainer;
