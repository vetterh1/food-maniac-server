/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/img-has-alt */
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import SimpleListOrDropdown from './SimpleListOrDropdown';

class SimpleListOrDropdownI18n extends React.Component {

  constructor(props) {
    super(props);

    this.defaultState = {
      items: [],
      locale: null,
    };

    this.state = {
      ...this.defaultState,
    };
  }

  componentDidMount() {
    this.getItemsFromI18nMessages();
  }

  componentDidUpdate() {
    const locale = this.context.intl.locale;
    if (locale !== this.state.locale) {
      this.getItemsFromI18nMessages();
    }
  }

  getItemsFromI18nMessages() {
    const locale = this.context.intl.locale;
    const messages = this.context.intl.messages;
    const listNamesRaw = messages && messages[`${this.props.i18nKey}.names`] ? messages[`${this.props.i18nKey}.names`] : '---';
    const listNamesArray = listNamesRaw.split(',');
    const listIdsRaw = messages && messages[`${this.props.i18nKey}.ids`] ? messages[`${this.props.i18nKey}.ids`] : '0';
    const listIdsArray = listIdsRaw.split(',');
    const items = [];
    for (let i = 0; i < listNamesArray.length; i += 1) {
      items.push({ id: listIdsArray[i], name: listNamesArray[i] });
    }
    this.setState({ items, locale });
  }

  render() {
    return (
      <SimpleListOrDropdown
        dropdown={this.props.dropdown}
        dropdownPlaceholder={this.props.dropdownPlaceholder}
        selectedOption={this.props.selectedOption}
        onChange={this.props.onChange}
        items={this.state.items}
      />
    );
  }
}

SimpleListOrDropdownI18n.propTypes = {
  dropdown: PropTypes.bool.isRequired,
  dropdownPlaceholder: React.PropTypes.string,
  selectedOption: React.PropTypes.string,
  onChange: PropTypes.func,
  i18nKey: PropTypes.string.isRequired,
};

SimpleListOrDropdownI18n.defaultProps = {
  dropdown: false,
  dropdownPlaceholder: null,
  selectedOption: '',
  onChange: null,
};

SimpleListOrDropdownI18n.contextTypes = { intl: React.PropTypes.object.isRequired };

export default SimpleListOrDropdownI18n;
