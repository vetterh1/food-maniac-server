import React from 'react';
import { Field } from 'redux-form';
import Slider from 'react-slick';
import * as log from 'loglevel';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';
import ReactFormInput from '../utils/ReactFormInput';
import ItemImage from '../utils/ItemImage';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Snackbar from 'material-ui/Snackbar';

const logListItems = log.getLogger('logListItems');
logListItems.setLevel('warn');
logListItems.debug('--> entering ListItems.jsx');


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
    dropdown: React.PropTypes.bool.isRequired,
    items: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);


    this.state = {
      indexSelected: 0,
      idSelected: props.items[0]._id,
    };

    logListItems.debug(`ListItems idSelected=${props.items[0]._id} (initial value)`);

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
    // logListItems.debug('props.item: ', this.props.items);

    // const settings = {
    //   centerMode: true,
    //   centerPadding: '60px',
    //   infinite: true,
    //   dots: true,
    //   lazyLoad: false,
    //   speed: 500,
    //   slidesToShow: 5,
    //   slidesToScroll: 5,
    //   initialSlide: 0,
    //   adaptiveHeight: false,
    //   responsive: [
    //     {
    //       breakpoint: 1560,
    //       settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 3,
    //         dots: true,
    //       },
    //     }, {
    //       breakpoint: 1040,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         dots: false,
    //       },
    //     }, {
    //       breakpoint: 640,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         dots: false,
    //       },
    //     }],
    // };

    const settings = {
      infinite: true,
      dots: false,
      lazyLoad: false,
      speed: 300,
      slidesToShow: 1,
      initialSlide: 0,
      adaptiveHeight: false,
      afterChange: (currentSlide) => {
        this.setState({ idSelected: this.props.items[currentSlide]._id });
        logListItems.debug(`ListItems idSelected=${this.props.items[currentSlide]._id}`);
      },
    };


    return (
      <div>
        { !this.props.carrousel && !this.props.dropdown &&
          <ul>
            {this.props.items.map((item, index) => (
              <ListOneItem index={index} item={item} key={item._id} />
            ))}
          </ul>
        }
        { !this.props.carrousel && this.props.dropdown &&
          <Field name="item" component={ReactFormInput} type="select" size="md">
            {this.props.items && this.props.items.map((item, index) => { return (<option key={item._id} value={item._id}>{item.name}</option>); })}
          </Field>
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
