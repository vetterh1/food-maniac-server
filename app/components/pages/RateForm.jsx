/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Alert from 'react-s-alert';
import { MatchMediaHOC } from 'react-match-media';
import { Button, Card, CardTitle, Col, Collapse, Form, Input, Label, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';
// import MdLocalCake from 'react-icons/lib/md/local-cake';
// import MdLocalBar from 'react-icons/lib/md/local-bar';
// import MdLocalCafe from 'react-icons/lib/md/local-cafe';
// import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';
// import MdRoomService from 'react-icons/lib/md/room-service';
import MdStore from 'react-icons/lib/md/store';
import MdMap from 'react-icons/lib/md/map';
// import MdLocationOn from 'react-icons/lib/md/location-on';
// import MdEditLocation from 'react-icons/lib/md/edit-location';
import MdLocationSearching from 'react-icons/lib/md/location-searching';
import MdStarHalf from 'react-icons/lib/md/star-half';
import MdEdit from 'react-icons/lib/md/edit';
import Scroll from 'react-scroll';

import RatingStarsRow from '../utils/RatingStarsRow';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import SelectItemPlus from '../utils/SelectItemPlus';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scroll = Scroll.animateScroll;
const optionsScroll = { duration: 750, delay: 300, smooth: true, offset: -25 };

const logRateForm = log.getLogger('logRateForm');
loglevelServerSend(logRateForm); // a setLevel() MUST be run AFTER this!
logRateForm.setLevel('debug');

const CollapseOnLargeScreens = MatchMediaHOC(Collapse, '(min-width: 576px)');
const ModalOnSmallScreens = MatchMediaHOC(Modal, '(max-width: 575px)');

const ALERT_HELP_TIMEOUT = 120000;

const LOCATION_TYPES = [
  { id: 'bakery', name: 'Bakery', icon: 'MdLocalCake' },
  { id: 'bar', name: 'Bar', icon: 'MdLocalBar' },
  { id: 'cafe', name: 'Cafe', icon: 'MdLocalCafe' },
  { id: 'restaurant', name: 'Restaurant', icon: 'MdLocalRestaurant' },
];




class RateForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    places: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRequestAddItem: PropTypes.func.isRequired,
    onRequestSimulateLocation: PropTypes.func.isRequired,
    onChangeLocationType: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this._refSelectItemPlus = null; // used to reset the 3 dropdowns

    this.alertHelp = null;

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      fillStep: 1, // 1: what, 2: where, 3: rate, 4: all

      item: null,
      markOverall: null,
      markFood: null,
      markPlace: null,
      markValue: null,
      markStaff: null,

      comment: '',

      location: '',
      locationType: 'restaurant',

      collapseType: false,
      collapseMarks: false,
    };

    this.state = {
//      location: props.places && props.places.places.length > 0 ? props.places.places[0].id : undefined,
      ...this.defaultState,
    };
    // console.log('RateForm constructor (props, initial state): ', props, this.state);
  }

  componentDidMount() {
    this.resetForm();

    // Remove the help alert whenever we leave the page
    browserHistory.listenBefore(() => { this.closeHelp(); });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps || !nextProps.places || nextProps.places.places.length <= 0) return;

    // Search if crt location still in the new list. If not, select the placeholder!
    if (this.state.location !== '' && !nextProps.places.places.some(place => place.id === this.state.location)) {
      this.setState({ location: '' });
    }
  }


  onSubmit(event) {
    event.preventDefault();

    const returnValue = {
      item: this.state.item,
      location: this.state.location,
      markOverall: this.state.markOverall,
      markFood: this.state.markFood,
      markValue: this.state.markValue,
      markPlace: this.state.markPlace,
      markStaff: this.state.markStaff,
      comment: this.state.comment,
    };
    // window.scrollTo(0, 0);
    scroll.scrollToTop(optionsScroll);
    this.props.onSubmit(returnValue);
  }

  onChangeItem(item, itemName) {
    if (this.state.item === item) return;
    this.setState({ item, itemName, fillStep: 2 });
    scroller.scrollTo('scrollElementWhere', optionsScroll);
    const msg = '<ul><li>The list shows the closest places...</li><li>Map: select an are on a map. The list will update with closest places there.</li><li>Type: Change the type of location (restaurant, bar,...)</li></ul>';
    this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
  }

  onDislayItemsFilter(opened) {
    if (opened) {
      const msg = '<ul><li>Choose a type or a category to restrict visible items.</li><li>The change is instantly reflected in the list.</li></ul>';
      this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
    } else { this.displayItemHelp(); }
  }


  onChangeLocation(event) {
    if (this.state.location === event.target.value) return;
    this.setState({ location: event.target.value, fillStep: 3 });
    scroller.scrollTo('scrollElementRate', optionsScroll);
    const msg = `How was your ${this.state.itemName ? this.state.itemName : 'plate'}?`;
    this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
  }


  onChangeLocationType(event) {
    if (this.state.locationType === event.target.value) return;
    this.setState({ locationType: event.target.value });
    this.props.onChangeLocationType(event.target.value);
  }


  onChangeMarkOverall(mark) {
    if (!mark || this.state.markOverall === mark) return;
    this.setState({ markOverall: parseInt(mark, 10), fillStep: 4 });
    scroller.scrollTo('scrollElementOptional', optionsScroll);
    const msg = '<ul><li>Click on details to rate the place, the price...</li><li>Or you could leave a comment.</li><li>Don\'t forget to save!</li></ul>';
    this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
  }

  onChangeMarkFood(mark) {
    if (!mark || this.state.markFood === mark) return;
    this.setState({ markFood: parseInt(mark, 10) });
  }

  onChangeMarkValue(mark) {
    if (!mark || this.state.markValue === mark) return;
    this.setState({ markValue: parseInt(mark, 10) });
  }

  onChangeMarkPlace(mark) {
    if (!mark || this.state.markPlace === mark) return;
    this.setState({ markPlace: parseInt(mark, 10) });
  }

  onChangeMarkStaff(mark) {
    if (!mark || this.state.markStaff === mark) return;
    this.setState({ markStaff: parseInt(mark, 10) });
  }

  onChangeComment(event) {
    if (this.state.comment === event.target.value) return;
    this.setState({ comment: event.target.value });
  }

  onOpenAddItem() {
    // const msg = '<ul><li>Select a type and category first.</li><li>Please use a simple name!</li><li>Picture is optional.</li></ul>';
    // this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
    this.closeHelp();

    this.props.onRequestAddItem();
  }

  onOpenSimulateLocation() {
    // const msg = '<ul><li>Zoom in/out to select an area.</li><li>No need to be very precise.</li><li>The place list will use the chosen location.</li></ul>';
    // this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
    this.closeHelp();

    this.props.onRequestSimulateLocation();
  }

  displayItemHelp() {
    const msg = '<ul><li>Select the item you want to rate...</li><li>Filters: Restrict the number of items by selecting types & categories.</li><li>Add: Add a new item if you can\'t find it in the list.</li></ul>';
    this.alertHelp = Alert.update(this.alertHelp, msg, 'info', { html: true, timeout: ALERT_HELP_TIMEOUT });
  }

  closeHelp() {
    if (this.alertHelp) { Alert.close(this.alertHelp); this.alertHelp = null; }
  }

  toggleType() {
    this.setState({ collapseType: !this.state.collapseType });
  }

  toggleMarks() {
    this.setState({ collapseMarks: !this.state.collapseMarks });
  }



  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({
      // Reset default location to the 1st one in the list
      location: this.props.places && this.props.places.places && this.props.places.places.length > 0 ? this.props.places.places[0].id : null,
    },
    // Erase marks & reset kind, categories & items:
    this.defaultState,
    ));
    this._refSelectItemPlus.reset();
    this.refReset.blur();
    // window.scrollTo(0, 0);
    scroll.scrollToTop(optionsScroll);

    setTimeout(() => {
      this.displayItemHelp();
    }, 2000);
  }



  renderTypeBody() {
    return (
      <div>
        <Row>
          <Col xs={12} sm={3} md={2} >
            <Label size="md">Type</Label>
          </Col>
          <Col xs={12} sm={9} md={10} >
            <SimpleListOrDropdown items={LOCATION_TYPES} selectedOption={this.state.locationType} onChange={this.onChangeLocationType.bind(this)} dropdown />
          </Col>
        </Row>
        <Row>
          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" size="md" onClick={this.toggleType.bind(this)}>Close</Button>
          </Col>
        </Row>
      </div>
    );
  }

  renderMarksBody() {
    return (
      <div>
        <Row>
          <Col xs={12} >
            <RatingStarsRow name="markFood" label="Food" initialRate={this.state.markFood} onChange={this.onChangeMarkFood.bind(this)} />
            <RatingStarsRow name="markValue" label="Value" initialRate={this.state.markValue} onChange={this.onChangeMarkValue.bind(this)} />
            <RatingStarsRow name="markPlace" label="Place" initialRate={this.state.markPlace} onChange={this.onChangeMarkPlace.bind(this)} />
            <RatingStarsRow name="markStaff" label="Staff" initialRate={this.state.markStaff} onChange={this.onChangeMarkStaff.bind(this)} />
          </Col>
        </Row>
        <Row>
          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" size="md" onClick={this.toggleMarks.bind(this)}>Close</Button>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const classNameBlockWhat = this.state.fillStep === 1 ? 'highlighted' : 'standard';
    const classNameBlockWhere = this.state.fillStep <= 1 ? 'dimmed' : (this.state.fillStep === 2 ? 'highlighted' : 'standard');
    const classNameBlockRate = this.state.fillStep <= 2 ? 'dimmed' : (this.state.fillStep === 3 ? 'highlighted' : 'standard');
    const classNameOptionalElements = this.state.fillStep <= 3 ? 'dimmed' : 'highlighted-option';
    const classNameBlockActions = this.state.fillStep <= 3 ? 'dimmed' : 'highlighted';
    // const opaqueOn = this.state.fillStep <= 3;
    logRateForm.debug(`render RateForm: (item=${this.state.item}, location=${this.state.location})`);
    const formReadyForSubmit = this.state.item && this.state.location && this.state.markOverall;
    return (
      <div className="standard-container">
        <h3 className="mb-4">Rate your plate!</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <Element name="scrollElementWhat" />
          <SelectItemPlus
            title="What"
            kinds={this.props.kinds.kinds}
            categories={this.props.categories.categories}
            items={this.props.items.items}
            defaultItem={this.props.items.defaultItem}
            onChangeItem={this.onChangeItem.bind(this)}
            onAddItem={this.onOpenAddItem.bind(this)}
            onDislayItemsFilter={this.onDislayItemsFilter.bind(this)}
            itemPlaceHolder="Select an item..."
            className={classNameBlockWhat}
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />

          <Element name="scrollElementWhere" />
          <div className={`mt-4 form-block element-with-transition ${classNameBlockWhere}`}>
            <h5 className="mb-3"><MdLocationSearching size={24} className="mr-2 hidden-sm-up" /> Where</h5>
            <Row className="" noGutters>
              <Col sm={2}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="homepage-feature-icon hidden-xs-down"><MdLocationSearching size={48} /></div>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <Label size="md" className="hidden-xs-down">Place</Label>
                </Row>
              </Col>
              <Col xs={12} sm={10}>
                <Row>
                  <Col xs={12} className="">
                    <SimpleListOrDropdown
                      items={this.props.places.places}
                      selectedOption={this.state.location}
                      onChange={this.onChangeLocation.bind(this)}
                      dropdownPlaceholder="Select a place..."
                      dropdown
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} sm={4}>
                    <Button block color="secondary" size="sm" onClick={this.onOpenSimulateLocation.bind(this)}><MdMap className="mr-2" size={24} /> Map</Button>
                  </Col>
                  <Col xs={6} sm={4} className="pl-0">
                    <Button block color="secondary" size="sm" onClick={this.toggleType.bind(this)}><MdStore className="mr-2" size={24} /> Type</Button>
                  </Col>
                </Row>
                <CollapseOnLargeScreens isOpen={this.state.collapseType}>
                  <Row>
                    <Col xs={12} sm={10} className="pl-0 pt-4" >
                      <Card block>
                        <CardTitle className="mb-4">Choose place type</CardTitle>
                        {this.renderTypeBody()}
                      </Card>
                    </Col>
                  </Row>
                </CollapseOnLargeScreens>
                <ModalOnSmallScreens className="hidden-md-up" isOpen={this.state.collapseType} toggle={this.toggleType.bind(this)}>
                  <ModalHeader toggle={this.toggleType.bind(this)}>Choose place type</ModalHeader>
                  <ModalBody>
                    {this.renderTypeBody()}
                  </ModalBody>
                </ModalOnSmallScreens>
              </Col>
            </Row>
          </div>


          <Element name="scrollElementRate" />
          <div className={`mt-4 form-block element-with-transition ${classNameBlockRate}`}>
            <h5 className="mb-3"><MdStarHalf size={24} className="mr-2 hidden-sm-up" /> Marks</h5>
            <Row className="" noGutters>
              <Col sm={2}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="homepage-feature-icon hidden-xs-down"><MdStarHalf size={48} /></div>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <Label size="md" className="hidden-xs-down">Marks</Label>
                </Row>
              </Col>
              <Col xs={12} sm={10}>
                <Row>
                  <Col xs={12} className="">
                    <RatingStarsRow name="markOverall" label="Overall" initialRate={this.state.markOverall} onChange={this.onChangeMarkOverall.bind(this)} />
                  </Col>
                </Row>
                <Element name="scrollElementOptional" />
                <Row>
                  <Col xs={6} sm={4} >
                    <Button block color="secondary" size="sm" className={`element-with-transition ${classNameOptionalElements}`} onClick={this.toggleMarks.bind(this)}><MdStore className="mr-2" size={24} /> Details</Button>
                  </Col>
                </Row>
                <CollapseOnLargeScreens isOpen={this.state.collapseMarks}>
                  <Row>
                    <Col xs={12} sm={10} className="pl-0 pt-4" >
                      <Card block>
                        <CardTitle className="mb-4">Mark details</CardTitle>
                        {this.renderMarksBody()}
                      </Card>
                    </Col>
                  </Row>
                </CollapseOnLargeScreens>
                <ModalOnSmallScreens className="hidden-md-up" isOpen={this.state.collapseMarks} toggle={this.toggleMarks.bind(this)}>
                  <ModalHeader toggle={this.toggleMarks.bind(this)}>Mark details</ModalHeader>
                  <ModalBody>
                    {this.renderMarksBody()}
                  </ModalBody>
                </ModalOnSmallScreens>
              </Col>
            </Row>
          </div>



          <Element name="scrollElementComment" />
          <div className={`mt-4 form-block element-with-transition ${classNameOptionalElements}`}>
            <h5 className="mb-3"><MdEdit size={24} className="mr-2 hidden-sm-up" /> Optional comment</h5>
            <Row className="" noGutters>
              <Col sm={2}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="homepage-feature-icon hidden-xs-down"><MdEdit size={48} /></div>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <Label size="md" className="hidden-xs-down">Comment</Label>
                </Row>
              </Col>
              <Col xs={12} sm={10}>
                <Row>
                  <Col xs={12} className="">
                    <Input type="textarea" value={this.state.comment} onChange={this.onChangeComment.bind(this)} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className={`mt-4 form-block element-with-transition ${classNameBlockActions}`}>
            <Button color="primary" type="submit" size="md" disabled={!formReadyForSubmit}>Save</Button>
            <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
          </div>


        </Form>
      </div>
    );
  }
}

export default RateForm;
