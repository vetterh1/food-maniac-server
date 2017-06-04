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
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
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
  }

  onChangeCategory(event) {
    if (this.state.category === event.target.value) return;
    this.setState({ category: event.target.value, filteredItemsList: this.getVisibleItems(this.state.kind, event.target.value) });
  }

  onChangeItem(event) {
    if (this.state.kind === event.target.value) return;
    this.setState({ item: event.target.value });
    this.props.onChange(event.target.value);
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
          <Col xs={3} lg={2} >
            <Label size="md">Category</Label>
          </Col>
          <Col xs={9} lg={10} >
            <SimpleListOrDropdown
              items={this.props.categories}
              dropdownPlaceholder="All"
              selectedOption={this.state.category}
              onChange={this.onChangeCategory.bind(this)} dropdown
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs={3} lg={2} >
            <Label size="md">Kind</Label>
          </Col>
          <Col xs={9} lg={10} >
            <SimpleListOrDropdown
              items={this.props.kinds}
              dropdownPlaceholder="All"
              selectedOption={this.state.kind}
              onChange={this.onChangeKind.bind(this)}
              dropdown
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs={3} lg={2} >
            <Label size="md">Item</Label>
          </Col>
          <Col xs={9} lg={10} >
            <SimpleListOrDropdown
              items={this.state.filteredItemsList}
              dropdownPlaceholder="Select an item..."
              selectedOption={this.state.item}
              onChange={this.onChangeItem.bind(this)}
              dropdown
            />
          </Col>
        </FormGroup>
      </FormGroup>
    );
  }
}

SelectItemPlus.defaultProps = { title: null };


export default SelectItemPlus;
