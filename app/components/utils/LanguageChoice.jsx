import React from 'react';
import PropTypes from 'prop-types';


class languageChoice extends React.Component {
  constructor() { super(); this._onClick = this._onClick.bind(this); }
  _onClick() { this.props.onClick(this.props.codeLanguage); }
  render() {
    return (
      <div
        onClick={this._onClick}
        role="button"
        className={`navbar-link
          text-lowercase
          font-italic
          nav-link
          ${this.props.selected ? 'text-primary font-weight-bold' : 'text-secondary font-italic'}`}
      >
        {this.props.codeLanguage}
      </div>
    );
  }
}

languageChoice.propTypes = {
  // index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  codeLanguage: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};


export default languageChoice;
