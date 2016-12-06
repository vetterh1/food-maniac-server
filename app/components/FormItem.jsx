import TextField from 'material-ui/TextField';
import React, { PropTypes } from 'react';

export default React.createClass({
  displayName: 'Form',

  propTypes: {
    children: PropTypes.node,
    values: PropTypes.object,
    update: PropTypes.func,
    reset: PropTypes.func,
    onSubmit: PropTypes.func,
  },

  render() {
    return (
      <div>

        <div>Form start...</div>
        <form>

          <TextField
            name="name"
            placeholder="Type your name here"
            label="Your name"
          />

          {this.props.children}
        </form>
        <div>Form end...</div>
      </div>
    );
  },
});