import React from 'react';
import Geosuggest from 'react-geosuggest';
import ChooseLocation from './ChooseLocation';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Rating from 'react-rating';
import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
          FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
// import Subheader from 'material-ui/Subheader';
import IconStar from 'material-ui/svg-icons/toggle/star';
import IconStarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconLocation from 'material-ui/svg-icons/communication/location-on';

const styles = {
  paperStyle: {
    // width: 300,
    margin: '20 auto',
    padding: 20,
  },
  switchStyle: {
    marginBottom: 16,
  },
  submitStyle: {
    marginTop: 32,
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
  markContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  markLine: {
    padding: '1em',
  },
  markLabel: {
  },
  markRate: {
  },
};


const tilesData = [
  {
    img: 'images/grid-list/00-52-29-429_640.jpg',
    title: 'Breakfast',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/burger-827309_640.jpg',
    title: 'Tasty burger',
    author: 'pashminu',
  },
  {
    img: 'images/grid-list/camera-813814_640.jpg',
    title: 'Camera',
    author: 'Danson67',
  },
  {
    img: 'images/grid-list/morning-819362_640.jpg',
    title: 'Morning',
    author: 'fancycrave1',
  },
  {
    img: 'images/grid-list/hats-829509_640.jpg',
    title: 'Hats',
    author: 'Hans',
  },
  {
    img: 'images/grid-list/honey-823614_640.jpg',
    title: 'Honey',
    author: 'fancycravel',
  },
  {
    img: 'images/grid-list/vegetables-790022_640.jpg',
    title: 'Vegetables',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/water-plant-821293_640.jpg',
    title: 'Water plant',
    author: 'BkrmadtyaKarki',
  },
];

class Rate extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
  }



  _handleClick() {
//    browserHistory.push(this.props.url);
  }

  onRate({ rating, lastRating, originalEvent }) {
    if (originalEvent.type === 'click' && rating === lastRating) {
    // set prop of Rater to 0
    }
  }


  render() {
    return (
      <MuiThemeProvider muiTheme={this.context.muiTheme}>
        <Paper style={styles.paperStyle}>
          <h1>Rate a dish...</h1>
          <Formsy.Form
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm}
            onInvalidSubmit={this.notifyFormError}
          >
            <h3>Where?</h3>
            <Geosuggest />
            <ChooseLocation />
            <FormsySelect
              name="where"
              required
              floatingLabelText="Where did you eat?"
            >
              <MenuItem value={'home'} primaryText="Home" />
              <MenuItem value={'place1'} primaryText="Place 1" />
              <MenuItem value={'place2'} primaryText="Place 2" />
              <MenuItem value={'place3'} primaryText="Place 3" />
            </FormsySelect>

            <h3>What?</h3>
            <GridList
              cellHeight={180}
              style={styles.gridList}
            >
              {tilesData.map(tile => (
                <GridTile
                  key={tile.img}
                  title={tile.title}
                  actionIcon={<IconButton><IconStarBorder color="rgb(0, 188, 212)" /></IconButton>}
                  titleStyle={styles.titleStyle}
                  titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                >
                  <img src={tile.img} />
                </GridTile>
              ))}
            </GridList>

            <FlatButton
              label="other dish..."
              labelPosition="after"
              primary
              style={styles.button}
              icon={<IconSearch />}
            />

            <h3>Marks</h3>
            <div style={styles.markContainer}>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Overall</span>
                <Rating
                  stop={5}
                  initialRate={4.5}
                  full={<IconStar />}
                  empty={<IconStarBorder />}
                  style={styles.markRate}
                />
              </div>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Quality</span>
                <Rating
                  stop={5}
                  initialRate={3}
                  full={<IconStar />}
                  empty={<IconStarBorder />}
                  style={styles.markRate}
                />
              </div>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Place</span>
                <Rating
                  stop={5}
                  initialRate={2}
                  full={<IconStar />}
                  empty={<IconStarBorder />}
                  style={styles.markRate}
                />
              </div>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Staff</span>
                <Rating
                  stop={5}
                  initialRate={5}
                  full={<IconStar />}
                  empty={<IconStarBorder />}
                  style={styles.markRate}
                />
              </div>

            </div>

            <h3>Picture</h3>

          </Formsy.Form>
        </Paper>
      </MuiThemeProvider>
    );
  }

}

export default Rate;


/*
              <Subheader>What did you eat?</Subheader>

import DropDownMenu from 'material-ui/DropDownMenu';

            <DropDownMenu>
              <MenuItem value={'home'} primaryText="Home" />
              <MenuItem value={'place1'} primaryText="Place 1" />
              <MenuItem value={'place2'} primaryText="Place 2" />
              <MenuItem value={'place3'} primaryText="Place 3" />
            </DropDownMenu>

*/