import React from 'react';
// import SelectCurrentLocation from '../containers/SelectCurrentLocation';
import SelectLocation from '../utils/SelectLocation';
// import RecentItemsContainer from '../utils/RecentItems';
import ListItemsContainer from '../pages/ListItemsContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Rating from 'react-rating';
import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
          FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
// import Paper from 'material-ui/Paper';
// import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
// import Subheader from 'material-ui/Subheader';
import IconStar from 'material-ui/svg-icons/toggle/star';
import IconStarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconSearch from 'material-ui/svg-icons/action/search';
// import IconLocation from 'material-ui/svg-icons/communication/location-on';

const styles = {
  paperStyle: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  switchStyle: {
    marginBottom: 16,
  },
  submitStyle: {
    marginTop: 32,
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


class Rate extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
  }


  onRate({ rating, lastRating, originalEvent }) {
    if (originalEvent.type === 'click' && rating === lastRating) {
    // set prop of Rater to 0
    }
  }


  _handleClick() {
//    browserHistory.push(this.props.url);
  }


  render() {
    return (
      <MuiThemeProvider muiTheme={this.context.muiTheme}>
        <div style={styles.paperStyle}>
          <h1>Rate a dish...</h1>
          <Formsy.Form
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm}
            onInvalidSubmit={this.notifyFormError}
          >
            <h3>Where?</h3>
            <SelectLocation />

            <h3>What?</h3>
            <ListItemsContainer URL="/api/items" pagination="5" />

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

        </div>
      </MuiThemeProvider>
    );
  }

}

export default Rate;


/*

            <RecentItemsContainer />


              <Subheader>What did you eat?</Subheader>

import DropDownMenu from 'material-ui/DropDownMenu';

            <DropDownMenu>
              <MenuItem value={'home'} primaryText="Home" />
              <MenuItem value={'place1'} primaryText="Place 1" />
              <MenuItem value={'place2'} primaryText="Place 2" />
              <MenuItem value={'place3'} primaryText="Place 3" />
            </DropDownMenu>

*/