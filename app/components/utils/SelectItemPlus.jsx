/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup, Label } from 'reactstrap';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logSelectItemPlus = log.getLogger('logSelectItemPlus');
loglevelServerSend(logSelectItemPlus); // a setLevel() MUST be run AFTER this!
logSelectItemPlus.setLevel('debug');


class SelectItemPlus extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    hideItem: PropTypes.bool,
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array,
    onChangeKind: PropTypes.func,
    onChangeCategory: PropTypes.func,
    onChangeItem: PropTypes.func,
    categoryPlaceHolder: PropTypes.string,
    kindPlaceHolder: PropTypes.string,
    itemPlaceHolder: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.defaultState = {
      // Selected Kind & Category:
      kind: '',
      category: '',
      item: '',
    };

    this.state = {
      // Items received from redux-store
      // and stored in state as it's altered by kind & category filters
      fullItemsList: props.items,
      filteredItemsList: props.items,

      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;

    // Check if full item list has changed. If yes: update it & reset default item
    if (nextProps.items && nextProps.items.length > 0 && nextProps.items !== this.state.fullItemsList) {
      this.setState({
        fullItemsList: nextProps.items,
        filteredItemsList: nextProps.items,
        item: '',
      });
    }
  }


  onChangeKind(event) {
    if (this.state.kind === event.target.value) return;
    this.setState({ kind: event.target.value, filteredItemsList: this.getVisibleItems(event.target.value, this.state.category) });
    if (this.props.onChangeKind) this.props.onChangeKind(event.target.value);
  }

  onChangeCategory(event) {
    if (this.state.category === event.target.value) return;
    this.setState({ category: event.target.value, filteredItemsList: this.getVisibleItems(this.state.kind, event.target.value) });
    if (this.props.onChangeCategory) this.props.onChangeCategory(event.target.value);
  }

  onChangeItem(event) {
    if (this.state.item === event.target.value) return;
    this.setState({ item: event.target.value });
    if (this.props.onChangeItem) this.props.onChangeItem(event.target.value);
  }

  // return the filtered list
  getVisibleItems(kind, category) {
    return this.state.fullItemsList.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
  }

  // Reset the 3 dropdowns:
  reset() {
    this.setState(Object.assign({
      // Reset with full list of items,
      fullItemsList: this.props.items,
      filteredItemsList: this.props.items,
    },
    // Reset selected category, kind & item:
    this.defaultState,
    ));
  }


  render() {
    logSelectItemPlus.debug(`render SelectItemPlus: (category=${this.state.category}, kind=${this.state.kind}, item=${this.state.item}`);
    return (
      <FormGroup>
        {this.props.title && <h5 className="mb-3">{this.props.title}</h5>}
        <FormGroup row>
          <Col xs={12} sm={2} >
            <Label size="md">Category</Label>
          </Col>
          <Col xs={12} sm={10} >
            <SimpleListOrDropdown
              items={this.props.categories}
              dropdownPlaceholder={this.props.categoryPlaceHolder}
              selectedOption={this.state.category}
              onChange={this.onChangeCategory.bind(this)}
              dropdown
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs={12} sm={2} >
            <Label size="md">Kind</Label>
          </Col>
          <Col xs={12} sm={10} >
            <SimpleListOrDropdown
              items={this.props.kinds}
              dropdownPlaceholder={this.props.kindPlaceHolder}
              selectedOption={this.state.kind}
              onChange={this.onChangeKind.bind(this)}
              dropdown
            />
          </Col>
        </FormGroup>
        {!this.props.hideItem &&
          <FormGroup row>
            <Col xs={12} sm={2} >
              <Label size="md">Item</Label>
            </Col>
            <Col xs={12} sm={10} >
              <SimpleListOrDropdown
                items={this.state.filteredItemsList}
                dropdownPlaceholder={this.props.itemPlaceHolder}
                selectedOption={this.state.item}
                onChange={this.onChangeItem.bind(this)}
                dropdown
              />
            </Col>
          </FormGroup>
        }
      </FormGroup>
    );
  }
}

SelectItemPlus.defaultProps = {
  title: null,
  hideItem: false,
  onChangeKind: null,
  onChangeCategory: null,
  onChangeItem: null,
  items: [],
  categoryPlaceHolder: 'All',
  kindPlaceHolder: 'All',
  itemPlaceHolder: 'Select an item...',
};


export default SelectItemPlus;
