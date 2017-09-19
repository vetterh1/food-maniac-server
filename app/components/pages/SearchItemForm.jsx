/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Label, Row } from 'reactstrap';
import MdMap from 'react-icons/lib/md/map';
import MdLocationSearching from 'react-icons/lib/md/location-searching';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import SelectItemPlus from '../utils/SelectItemPlus';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logSearchItemForm = log.getLogger('logSearchItemForm');
loglevelServerSend(logSearchItemForm); // a setLevel() MUST be run AFTER this!
logSearchItemForm.setLevel('debug');


class SearchItemForm extends React.Component {
  static propTypes = {
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
      distanceList: [],
      distanceLanguage: null,
    };

    this.state = {
      ...this.defaultState,
    };
  }

  componentDidMount() {
    // this.setState({ distanceLanguage: this.context.intl.messages });
    this.getPredifinedDistances();
  }

  componentWillReceiveProps(nextProps) {
    const locale = this.context.intl.locale;
    if (locale !== this.state.locale) {
      this.getPredifinedDistances();
    }
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


  // TODO: i18n

  /*
    "distance.max": "Max distance",
    "distance.unit": "I", // Imperial
    "distance.list.display": "[500 yards,1/2 mile,1 mile,5 miles,10 miles,50 miles,100 miles,500 miles]",
    "distance.list.in.meters": "[457,805,1609,8047,16093,80467,160934,804672]",
    "distance.list": "[{id:'457', name:'500 yards'}, {id:'805', name:'1/2 mile'}, {id:'1609', name:'1 mile'}]",
    OK: "distance.list": "[{\"id\":\"457\", \"name\":\"500 yards\"}, {\"id\":\"805\", \"name\":\"1/2 mile\"}, {\"id\":\"1609\", \"name\":\"1 mile\"}]",
  */

  getPredifinedDistances() {
    const locale = this.context.intl.locale;
    const messages = this.context.intl.messages;
    const listNamesRaw = messages && messages['distance.list.names'] ? messages['distance.list.names'] : '---';
    const listNamesArray = listNamesRaw.split(',');
    const listIdsRaw = messages && messages['distance.list.ids'] ? messages['distance.list.ids'] : '0';
    const listIdsArray = listIdsRaw.split(',');
    const distanceList = [];
    for (let i = 0; i < listNamesArray.length; i += 1) {
      distanceList.push({ id: listIdsArray[i], name: listNamesArray[i] });
    }
    console.log('distanceList:', distanceList);
    this.setState({ distanceList, locale });
    // return listJson;
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
        <h3 className="mb-4">Seach the best place!</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <SelectItemPlus
            title={what}
            kinds={this.props.kinds.kinds}
            categories={this.props.categories.categories}
            items={this.props.items}
            onChangeItem={this.onChangeItem.bind(this)}
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />

          <div className="mt-4">
            <h5 className="mb-3">
              <MdLocationSearching size={24} className="mr-2 hidden-sm-up" />
              <FormattedMessage id="core.where" />
            </h5>
            <Row className="form-block" noGutters>
              <Col sm={2}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="homepage-feature-icon hidden-xs-down">
                    <MdLocationSearching size={48} />
                  </div>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <Label size="md" className="hidden-xs-down">
                    <FormattedMessage id="distance.max" />
                  </Label>
                </Row>
              </Col>
              <Col xs={12} sm={10}>
                <Row>
                  <Col xs={12} className="">
                    <SimpleListOrDropdown
                      items={this.state.distanceList}
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
              type="submit" size="md"
              disabled={!formReadyForSubmit}
              getRef={(ref) => { this.refSubmit = ref; }}
            >
              <FormattedMessage id="core.find" />
            </Button>
            <Button
              color="link"
              onClick={this.resetForm.bind(this)}
              size="md"
              getRef={(ref) => { this.refReset = ref; }}
            >
              <FormattedMessage id="core.reset" />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

SearchItemForm.contextTypes = { intl: React.PropTypes.object.isRequired };

export default SearchItemForm;
