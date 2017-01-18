import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Formsy from 'formsy-react';
import { FormsySelect, FormsyText /* ,FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsyTime, FormsyToggle, FormsyAutoComplete */ } from 'formsy-material-ui/lib';
import Paper from 'material-ui/Paper';
// import FlatButton from 'material-ui/FlatButton';
// import IconSearch from 'material-ui/svg-icons/action/search';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';



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
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
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
  }

  constructor() {
    super();
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.kindChange = this.kindChange.bind(this);

    this.state = {
      canSubmit: false,
      category: '',
      kind: '',
    };
  }


  categoryChange(event, value) {
    this.setState({
      category: value,
    });
  }

  kindChange(event, value) {
    this.setState({
      kind: value,
    });
  }

  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }



  render() {
    return (
      <MuiThemeProvider muiTheme={this.context.muiTheme}>
        <div style={styles.paperStyle}>
          <h1>New dish...</h1>
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
                onChange={this.categoryChange}
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
                onChange={this.kindChange}
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
                style={styles.item}
              />
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

// <div>Category: {this.state.category}</div>
// <div>Kind: {this.state.kind}</div>
