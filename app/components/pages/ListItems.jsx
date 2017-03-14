import React from 'react';
import Slider from 'react-slick';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Snackbar from 'material-ui/Snackbar';


const styles = {
  serverUnknown: {
    // color: 'grey',
  },
  serverOK: {
    color: 'green',
  },
  serverKO: {
    color: 'red',
  },
};


class ItemImage extends React.Component {

  static propTypes = {
    id: React.PropTypes.string,
  }

  render() {
    if (!this.props.id) return null;
    return (<object data={`/static/thumbnails/${this.props.id}.jpg`} type="image/jpg"><MdLocalRestaurant size={96} /></object>);
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


class CarrouselOneItem extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    item: React.PropTypes.object.isRequired,
  }

  render() {
    let styleGivenByServer = styles.serverUnknown;
    if (this.props.item.serverState === 'OK') styleGivenByServer = styles.serverOK;
    if (this.props.item.serverState === 'KO') styleGivenByServer = styles.serverKO;
    return (<div style={styleGivenByServer}>{this.props.item.name} <ItemImage id={this.props.item.picture} /></div>);
    // return (<div style={styleGivenByServer}>{this.props.item.name}</div>);
  }
}



class ListItems extends React.Component {
  static propTypes = {
    carrousel: React.PropTypes.bool.isRequired,
    items: React.PropTypes.array.isRequired,
  }

  constructor() {
    super();
/*
    this.state = {
      snackbarOpen: false,
      snackbarMessage: '.',
      snackbarTimeout: 4000,
    };
  */
  }

/*
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
*/
  render() {
    // console.log('props.item: ', this.props.items);
    const settings = {
      dots: true,
      lazyLoad: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      adaptiveHeight: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: true,
          },
        }, {
          breakpoint: 950,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            dots: false,
          },
        }, {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
          },
        }],
    };


    return (
      <div>
        { !this.props.carrousel &&
          <ul>
            {this.props.items.map((item, index) => (
              <ListOneItem index={index} item={item} key={item._id} />
            ))}
          </ul>
        }
        { this.props.carrousel &&
          <div style={styles.carrousel} className="carrousel">
            <Slider {...settings} style={styles.carrouselInner}>
              {this.props.items.map((item, index) => (
                <div key={item._id}><h6><div className="row justify-content-center"><object data={`/static/thumbnails/${item.picture}.jpg`} type="image/jpg"><MdLocalRestaurant size={96} /></object></div><div className="row justify-content-center">{item.name}</div></h6></div>
              ))}
            </Slider>
          </div>
        }
      </div>
    );
  }

}



export default ListItems;
