import React from 'react';
import { Container, Col, Button, Label, FormGroup, Alert } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
// import SelectCurrentLocation from '../containers/SelectCurrentLocation';
import SelectLocation from '../utils/SelectLocation';
// import RecentItemsContainer from '../utils/RecentItems';
import ListItemsContainer from '../pages/ListItemsContainer';
import Rating from 'react-rating';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';
/*
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
          FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import FlatButton from 'material-ui/FlatButton';
import MdStar from 'material-ui/svg-icons/toggle/star';
import MdStarOutline from 'material-ui/svg-icons/toggle/star-border';
import IconSearch from 'material-ui/svg-icons/action/search';
*/
// import Subheader from 'material-ui/Subheader';
// import IconLocation from 'material-ui/svg-icons/communication/location-on';
// import Paper from 'material-ui/Paper';
// import MenuItem from 'material-ui/MenuItem';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
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
//    onSubmit: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
//    this._handleClick = this._handleClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.state = {
      keyForm: Date.now(),  // unique key for the form --> used for reset form
      canSubmit: false,
      // alertStatus possible values:
      // -  0: no alerts
      //  - saving alerts:  1: saving, 2: saving OK, -1: saving KO
      alertStatus: 0,
      alertMessage: '',
    };
  }


  onRate({ rating, lastRating, originalEvent }) {
    if (originalEvent.type === 'click' && rating === lastRating) {
    // set prop of Rater to 0
    }
  }

  submitForm(event, values) {
    // console.log('submitForm - state:', this.state);

    // Add picture to data
    // const dataWithPicture = Object.assign({}, values, { picture: this.state.picture });
    // this.setState({ values }, this.props.onSubmit(dataWithPicture)); // callback fn: send data back to container

//    this.props.onSubmit(values);
  }

  resetForm() {
    // Reset the form & clear the image
    this.setState({ keyForm: Date.now() });
  }



  _handleClick() {
//    browserHistory.push(this.props.url);
  }


  render() {
    const defaultValues = {
    };

    return (
      <Container>

        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}

        <h2>Rate a dish...</h2>
        <AvForm
          key={this.state.keyForm}  // unique key that let reset the form by changing the state keyForm
          // onValid={this.enableButton}
          // onInvalid={this.disableButton}
          onValidSubmit={this.submitForm}
          // onInvalidSubmit={this.notifyFormError}
          model={defaultValues}
        >
          <FormGroup>
            <h4>What?</h4>
            <ListItemsContainer URL="/api/items" itemsPerPage={10} />
          </FormGroup>

          <FormGroup>
            <h4>Where?</h4>
            <SelectLocation />
          </FormGroup>

          <FormGroup>
            <h4>Marks</h4>
            <div>
              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markOverall" className="text-right">Overall</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Rating
                    id="markOverall"
                    stop={5}
                    initialRate={4.5}
                    full={<MdStar size={30} />}
                    empty={<MdStarOutline size={30} />}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markQuality" className="text-right">Quality</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Rating
                    id="markQuality"
                    stop={5}
                    initialRate={3}
                    full={<MdStar size={26} />}
                    empty={<MdStarOutline size={26} />}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markPlace" className="text-right">Place</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Rating
                    id="markPlace"
                    stop={5}
                    initialRate={3}
                    full={<MdStar size={26} />}
                    empty={<MdStarOutline size={26} />}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markStaff" className="text-right">Staff</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Rating
                    id="markStaff"
                    stop={5}
                    initialRate={3}
                    full={<MdStar size={26} />}
                    empty={<MdStarOutline size={26} />}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>
            </div>
          </FormGroup>



          <Button type="submit" size="md">Add</Button>
          <Button color="link" onClick={this.resetForm} size="md">Reset</Button>
        </AvForm>
      </Container>
    );
  }


  /*
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
            <h4>Where?</h4>
            <SelectLocation />

            <h4>What?</h4>
            <ListItemsContainer URL="/api/items" pagination="5" />

            <FlatButton
              label="other dish..."
              labelPosition="after"
              primary
              style={styles.button}
              icon={<IconSearch />}
            />

            <h4>Marks</h4>
            <div style={styles.markContainer}>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Overall</span>
                <Rating
                  stop={5}
                  initialRate={4.5}
                  full={<MdStar />}
                  empty={<MdStarOutline />}
                  style={styles.markRate}
                />
              </div>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Quality</span>
                <Rating
                  stop={5}
                  initialRate={3}
                  full={<MdStar />}
                  empty={<MdStarOutline />}
                  style={styles.markRate}
                />
              </div>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Place</span>
                <Rating
                  stop={5}
                  initialRate={2}
                  full={<MdStar />}
                  empty={<MdStarOutline />}
                  style={styles.markRate}
                />
              </div>

              <div style={styles.markLine}>
                <span style={styles.markLabel}>Staff</span>
                <Rating
                  stop={5}
                  initialRate={5}
                  full={<MdStar />}
                  empty={<MdStarOutline />}
                  style={styles.markRate}
                />
              </div>

            </div>

            <h4>Picture</h4>

          </Formsy.Form>

        </div>
      </MuiThemeProvider>
    );
  }      */


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