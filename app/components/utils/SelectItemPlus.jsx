/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/img-has-alt */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { MatchMediaHOC } from 'react-match-media';
import { Button, Card, CardTitle, Col, Collapse, Label, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';
import MdFilterList from 'react-icons/lib/md/filter-list';
import MdPlaylistAdd from 'react-icons/lib/md/playlist-add';
// import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';
import MdRoomService from 'react-icons/lib/md/room-service';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logSelectItemPlus = log.getLogger('logSelectItemPlus');
loglevelServerSend(logSelectItemPlus); // a setLevel() MUST be run AFTER this!
logSelectItemPlus.setLevel('debug');

const CollapseOnLargeScreens = MatchMediaHOC(Collapse, '(min-width: 576px)');
const ModalOnSmallScreens = MatchMediaHOC(Modal, '(max-width: 575px)');


class SelectItemPlus extends React.Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    title: PropTypes.string,
    hideItem: PropTypes.bool,
    onAddItem: PropTypes.func,
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array,
    defaultItem: PropTypes.string,
    onChangeKind: PropTypes.func,
    onChangeCategory: PropTypes.func,
    onChangeItem: PropTypes.func,
    onDislayItemsFilter: PropTypes.func,
    categoryPlaceHolder: PropTypes.string,
    kindPlaceHolder: PropTypes.string,
    // itemPlaceHolder: Item added to the list (ex: 'All')
    // when selected, onChangeItem returns null
    itemPlaceHolder: PropTypes.string,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.defaultState = {
      locale: null,
      // Selected Kind & Category:
      kind: '',
      category: '',
      item: this.props.defaultItem || '',
      collapseFilters: false,
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


  componentDidMount() {
    this.setI18nLabels();
  }


  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;

    if (this.props.locale !== nextProps.locale) {
      this.setI18nLabels();
    }

    // Check if full item list has changed. If yes: update it & reset default item
    if (nextProps.items && nextProps.items.length > 0 && nextProps.items !== this.state.fullItemsList) {
      this.setState({
        fullItemsList: nextProps.items,
        filteredItemsList: nextProps.items,
        item: nextProps.defaultItem || '',
      });
      // If default item, tell parent about it so it can enable the Submit btn
      if (nextProps.defaultItem) {
        this.props.onChangeItem(nextProps.defaultItem, null);
      }
    }
  }


  componentDidUpdate() {
    const categoryPlaceHolder = this.props.categoryPlaceHolder || this.context.intl.formatMessage({ id: 'core.all' });
    if (this.state.categoryPlaceHolder !== categoryPlaceHolder) {
      this.setI18nLabels();
    }
  }

  onChangeKind(event) {
    if (this.state.kind === event.target.value) return;
    // console.log('onChangeKind (value):', event.target.value );
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
    if (this.props.onChangeItem) {
      const itemObject = event.target.value ? this.state.filteredItemsList.find((item) => { return item.id === event.target.value; }) : null;
      // console.log('onChangeItem (value, itemObject):', event.target.value, itemObject );
      this.props.onChangeItem(event.target.value, itemObject ? itemObject.name : null);
    }
  }


  setI18nLabels() {
    const categoryPlaceHolder = this.props.categoryPlaceHolder || this.context.intl.formatMessage({ id: 'core.all' });
    const kindPlaceHolder = this.props.kindPlaceHolder || this.context.intl.formatMessage({ id: 'core.all' });
    const itemPlaceHolder = this.props.itemPlaceHolder || this.context.intl.formatMessage({ id: 'core.all' });
    this.setState({ categoryPlaceHolder, kindPlaceHolder, itemPlaceHolder });

    // const categories = this.props.categories.map(category => ({ ...category, name: category.i18n[this.props.locale] || category.name }));
    // const kinds = this.props.kinds.map(kind => ({ ...kind, name: kind.i18n[this.props.locale] || kind.name }));
    const categories = this.getI18nVersion(this.props.categories);
    const kinds = this.getI18nVersion(this.props.kinds);
    this.setState({ categoryPlaceHolder, kindPlaceHolder, itemPlaceHolder, categories, kinds });
  }

  getI18nVersion(list) {
    return list.map(item => ({ ...item, name: (item.i18n && item.i18n[this.props.locale]) ? item.i18n[this.props.locale] : item.name }));
  }

  // return the filtered list
  getVisibleItems(kind, category) {
    return this.state.fullItemsList.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
  }


  toggleFilters() {
    const newState = !this.state.collapseFilters;

    // Ask parent to display special help when opening filters
    // (or original help msg on close)
    if (this.props.onDislayItemsFilter) this.props.onDislayItemsFilter(newState);

    this.setState({ collapseFilters: newState });
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


  renderFiltersBody(showCloseButton = true) {
    return (
      <div>
        <Row>
          <Col xs={12} sm={3} md={2} >
            <Label size="md">
              <FormattedMessage id="core.category" />
            </Label>
          </Col>
          <Col xs={12} sm={9} md={10} >
            <SimpleListOrDropdown
              items={this.state.categories}
              dropdownPlaceholder={this.state.categoryPlaceHolder}
              selectedOption={this.state.category}
              onChange={this.onChangeCategory.bind(this)}
              dropdown
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3} md={2} >
            <Label size="md">
              <FormattedMessage id="core.kind" />
            </Label>
          </Col>
          <Col xs={12} sm={9} md={10} >
            <SimpleListOrDropdown
              items={this.state.kinds}
              dropdownPlaceholder={this.state.kindPlaceHolder}
              selectedOption={this.state.kind}
              onChange={this.onChangeKind.bind(this)}
              dropdown
            />
          </Col>
        </Row>
        { showCloseButton &&
          <Row>
            <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                color="primary"
                size="md"
                onClick={this.toggleFilters.bind(this)}
              >
                <FormattedMessage id="core.close" />
              </Button>
            </Col>
          </Row>
        }
      </div>
    );
  }


  render() {
    logSelectItemPlus.debug(`render SelectItemPlus: (category=${this.state.category}, kind=${this.state.kind}, item=${this.state.item}`);
    return (
      <div className={`form-block ${this.props.className}`}>
        {this.props.title &&
          <h5 className="mb-3">
            <MdRoomService size={24} className="mr-2 hidden-sm-up" />
            {this.props.title}
          </h5>
        }

        {!this.props.hideItem &&
          <Row className="" noGutters>
            <Col sm={2}>
              <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="homepage-feature-icon hidden-xs-down">
                  <MdRoomService size={48} />
                </div>
              </Row>
              <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Label size="md" className="hidden-xs-down">
                  <FormattedMessage id="core.item" />
                </Label>
              </Row>
            </Col>
            <Col xs={12} sm={10}>
              <Row>
                <Col xs={12} className="">
                  <SimpleListOrDropdown
                    items={this.getI18nVersion(this.state.filteredItemsList)}
                    dropdownPlaceholder={this.state.itemPlaceHolder}
                    selectedOption={this.state.item}
                    onChange={this.onChangeItem.bind(this)}
                    dropdown
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={4} className="">
                  <Button
                    block
                    color="secondary"
                    size="sm"
                    onClick={this.toggleFilters.bind(this)}
                  >
                    <MdFilterList className="mr-2" size={24} />
                    <FormattedMessage id="core.filters" />
                  </Button>
                </Col>
                {this.props.onAddItem &&
                  <Col xs={6} sm={4} >
                    <Button
                      block
                      color="secondary"
                      size="sm"
                      onClick={this.props.onAddItem}
                    >
                      <MdPlaylistAdd className="mr-2" size={24} />
                      <FormattedMessage id="core.add" />
                    </Button>
                  </Col>
                }
              </Row>

              <CollapseOnLargeScreens isOpen={this.state.collapseFilters}>
                <Row>
                  <Col xs={12} sm={10} className="pl-0 pt-4" >
                    <Card block>
                      <CardTitle className="mb-4">
                        <FormattedMessage id="item.filter.short" />
                      </CardTitle>
                      {this.renderFiltersBody()}
                    </Card>
                  </Col>
                </Row>
              </CollapseOnLargeScreens>
              <ModalOnSmallScreens
                className="hidden-md-up"
                isOpen={this.state.collapseFilters}
                toggle={this.toggleFilters.bind(this)}
              >
                <ModalHeader toggle={this.toggleFilters.bind(this)}>
                  <FormattedMessage id="item.filter.short" />
                </ModalHeader>
                <ModalBody>
                  {this.renderFiltersBody()}
                </ModalBody>
              </ModalOnSmallScreens>
            </Col>
          </Row>
        }

        {this.props.hideItem &&
          <div>
            {this.renderFiltersBody(false)}
          </div>
        }


      </div>
    );
  }
}


SelectItemPlus.contextTypes = { intl: PropTypes.object.isRequired };


SelectItemPlus.defaultProps = {
  title: null,
  hideItem: false,
  onAddItem: null,
  onChangeKind: null,
  onChangeCategory: null,
  onChangeItem: null,
  onDislayItemsFilter: null,
  items: [],
  defaultItem: null,
  categoryPlaceHolder: null,
  kindPlaceHolder: null,
  itemPlaceHolder: null,
  className: '',
  alertHelp: null,
};


export default SelectItemPlus;
