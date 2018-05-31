/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Label, Row } from 'reactstrap';
import MdMap from 'react-icons/lib/md/map';
import MdLocationSearching from 'react-icons/lib/md/location-searching';
import SimpleListOrDropdownI18n from '../utils/SimpleListOrDropdownI18n';
import SelectItemPlus from '../utils/SelectItemPlus';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logSearchItemForm = log.getLogger('logSearchItemForm');
loglevelServerSend(logSearchItemForm); // a setLevel() MUST be run AFTER this!
logSearchItemForm.setLevel('debug');


class SearchItemForm extends React.Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    kinds: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    onRequestSimulateLocation: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    logSearchItemForm.debug('SearchItemForm constructor props: ', props);

    this._refSelectItemPlus = null; // used to reset the 3 dropdowns

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      item: null,
      distance: '500',
    };

    this.state = {
      ...this.defaultState,
    };
  }




  onSubmit(event) {
    event.preventDefault();

    const returnValue = {
      item: this.state.item,
      distance: this.state.distance,
    };
    this.refSubmit.blur();
    this.props.onSubmit(returnValue);
  }


  onChangeItem(item) {
    if (this.state.item === item) return;
    this.setState({ item });
  }


  onChangeDistance(event) {
    if (this.state.distance === event.target.value) return;
    this.setState({ distance: event.target.value });
  }

  onOpenSimulateLocation() {
    this.props.onRequestSimulateLocation();
  }


  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({}, this.defaultState));
    this._refSelectItemPlus.reset();
    this.refReset.blur();
    window.scrollTo(0, 0);
    this.props.resetForm();
  }

  render() {
    logSearchItemForm.debug('render SearchItemForm: (category, kind, item)=', this.state.category, this.state.kind, this.state.item);
    const formReadyForSubmit = true; // Always propose submit now that 'All' the default item.
    // const formReadyForSubmit = this.state.item && this.state.distance;

    // i18n:
    const what = this.context.intl.formatMessage({ id: 'core.what' });

    return (
      <div className="standard-container">
        <h3 className="mb-4"><FormattedMessage id="item.search.long" /></h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <SelectItemPlus
            locale={this.props.locale}
            title={what}
            kinds={this.props.kinds.kinds}
            categories={this.props.categories.categories}
            items={this.props.items}
            onChangeItem={this.onChangeItem.bind(this)}
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />

          <div className="mt-4 form-block">
            <h5 className="mb-3 d-sm-none">
              <MdLocationSearching size={24} className="mr-2" />
              <FormattedMessage id="core.where" />
            </h5>
            <Row>
              <Col sm={2} className="pr-0 d-none d-sm-block">
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="homepage-feature-icon">
                    <MdLocationSearching size={48} />
                  </div>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }} className="mt-2">
                  <Label size="md">
                    <FormattedMessage id="core.where" />
                  </Label>
                </Row>
              </Col>
              <Col xs={12} sm={10}>
                <Row>
                  <Col xs={12} className="">
                    <SimpleListOrDropdownI18n
                      i18nKey="distance.list"
                      selectedOption={this.state.distance}
                      onChange={this.onChangeDistance.bind(this)}
                      dropdown
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} sm={4}>
                    <Button
                      block
                      color="secondary"
                      size="sm"
                      onClick={this.onOpenSimulateLocation.bind(this)}
                    >
                      <MdMap className="mr-2" size={24} />
                      <FormattedMessage id="core.map" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className="mt-4">
            <Button
              color="primary"
              type="submit"
              size="md"
              disabled={!formReadyForSubmit}
              innerRef={(ref) => { this.refSubmit = ref; }}
            >
              <FormattedMessage id="core.find" />
            </Button>
            <Button
              color="link"
              onClick={this.resetForm.bind(this)}
              size="md"
              innerRef={(ref) => { this.refReset = ref; }}
            >
              <FormattedMessage id="core.reset" />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

SearchItemForm.contextTypes = { intl: PropTypes.object.isRequired };

export default SearchItemForm;
