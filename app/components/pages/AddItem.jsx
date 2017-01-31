import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Formsy from 'formsy-react';
import { FormsySelect, FormsyText /* ,FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsyTime, FormsyToggle, FormsyAutoComplete */ } from 'formsy-material-ui/lib';
// import FlatButton from 'material-ui/FlatButton';
// import IconSearch from 'material-ui/svg-icons/action/search';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import CameraSnapshotContainer from './CameraSnapshotContainer';


const errorMessages = {
  wordsError: 'Please only use letters',
  numericError: 'Please provide a number',
  urlError: 'Please provide a valid URL',
};


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
};

class AddItem extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.notifyFormError = this.notifyFormError.bind(this);
    // this.categoryChange = this.categoryChange.bind(this);
    // this.kindChange = this.kindChange.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.onSnapshot = this.onSnapshot.bind(this);

    this.state = {
      canSubmit: false,
      messageType: null,
      messageText: null,
      name: '',
      picture: null,
      // category: '',
      // kind: '',
    };
  }



  // categoryChange(event, value) { this.setState({ category: value }); }
  // kindChange(event, value) { this.setState({ kind: value }); }

  nameChange(event, value) {
    this.setState({ name: value });
    console.log('AddItem.nameChange value:', value);
    // TODO : Should verify on server side if name already exists
  }

  enableButton() { this.setState({ canSubmit: true }); }
  disableButton() { this.setState({ canSubmit: false }); }

  submitForm(data) {
    // Add picture to data
    const dataWithPicture = Object.assign(data, { picture: this.state.picture });
    this.setState(
      { messageType: 'info', messageText: 'Sending...' },
      this.props.onSubmit(dataWithPicture) // callback fn: send data back to container
    );
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }


  onSnapshot = (data) => {
    console.log('AddItem.onSnapshot() snapshot length: ', data.length);
    this.setState({ picture: data });
  }


  render() {
    let status = '';
    if (this.state.messageType && this.state.messageText) {
      const classString = `alert alert-${this.state.messageType}`;
      status = <div id="status" className={classString} ref={(node) => { this.status = node; }}>{this.state.messageText}</div>;
    }

    return (
      <MuiThemeProvider muiTheme={this.context.muiTheme}>
        <div style={styles.paperStyle}>
          <h1>New dish...</h1>
          {status}
          <Formsy.Form
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm}
            onInvalidSubmit={this.notifyFormError}
          >
            <div
              style={styles.form_content}
            >
              <FormsySelect
                name="category"
                required
                floatingLabelText="Category"
                // onChange={this.categoryChange}
                style={styles.item}
              >
                <MenuItem value={'dish'} primaryText="Dish" />
                <MenuItem value={'dessert'} primaryText="Dessert" />
                <MenuItem value={'drink'} primaryText="Drink" />
              </FormsySelect>

              <FormsySelect
                name="kind"
                required
                floatingLabelText="Kind"
                // onChange={this.kindChange}
                style={styles.item}
              >
                <MenuItem value={'italian'} primaryText="Italian" />
                <MenuItem value={'french'} primaryText="French" />
                <MenuItem value={'mexican'} primaryText="Mexican" />
                <MenuItem value={'indian'} primaryText="Indian" />
                <MenuItem value={'american'} primaryText="American" />
                <MenuItem value={'other'} primaryText="Other" />
              </FormsySelect>
            </div>

            <div
              style={styles.form_content}
            >
              <FormsyText
                name="name"
                required
                validations="isWords"
                validationError={errorMessages.wordsError}
                hintText="Name"
                floatingLabelText="Name"
                onChange={this.nameChange}
                style={styles.item}
              />
            </div>

            <div>
              <h4>Picture</h4>
              <CameraSnapshotContainer onSnapshot={this.onSnapshot} />
            </div>

            <div
              style={styles.form_buttons}
            >
              <RaisedButton
                style={styles.submitStyle}
                type="submit"
                label="Add"
                disabled={!this.state.canSubmit}
              />
            </div>

          </Formsy.Form>
        </div>
      </MuiThemeProvider>
    );
  }

}

export default AddItem;
