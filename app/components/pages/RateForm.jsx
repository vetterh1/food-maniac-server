/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
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

import RatingStarsRow from '../utils/RatingStarsRow';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import SelectItemPlus from '../utils/SelectItemPlus';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logRateForm = log.getLogger('logRateForm');
loglevelServerSend(logRateForm); // a setLevel() MUST be run AFTER this!
logRateForm.setLevel('debug');

const CollapseOnLargeScreens = MatchMediaHOC(Collapse, '(min-width: 576px)');
const ModalOnSmallScreens = MatchMediaHOC(Modal, '(max-width: 575px)');


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

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      item: null,
      markOverall: null,
      markFood: null,
      markPlace: null,
      markValue: null,
      markStaff: null,

      comment: '',

      locationType: 'restaurant',

      collapseType: false,
      collapseMarks: false,
    };

    this.state = {
      location: props.places && props.places.places.length > 0 ? props.places.places[0].id : undefined,
      ...this.defaultState,
    };
    // console.log('RateForm constructor (props, initial state): ', props, this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;

    // Search if crt location still in the new list:
    const bCrtIndexInStillInNewPlaces = nextProps.places.places.some(place => place.id === this.state.location);

    // Prepare the default location selection if necessary
    if (nextProps.places && nextProps.places.places.length > 0 && (!bCrtIndexInStillInNewPlaces || !this.state.location || this.state.location === '')) {
      logRateForm.debug(`RateForm.componentWillReceiveProps: new location=${nextProps.places.places[0].id} old=${this.state.location}`);
      this.setState({ location: nextProps.places.places[0].id });
    } else {
      logRateForm.debug(`RateForm.componentWillReceiveProps: no new location. crt=${this.state.location}`);
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
    window.scrollTo(0, 0);
    this.props.onSubmit(returnValue);
  }

  onChangeItem(item) {
    if (this.state.item === item) return;
    this.setState({ item });
  }


  onChangeLocation(event) {
    if (this.state.location === event.target.value) return;
    this.setState({ location: event.target.value });
  }


  onChangeLocationType(event) {
    if (this.state.locationType === event.target.value) return;
    this.setState({ locationType: event.target.value });
    this.props.onChangeLocationType(event.target.value);
  }


  onChangeMarkOverall(mark) {
    if (!mark || this.state.markOverall === mark) return;
    this.setState({ markOverall: parseInt(mark, 10) });
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
    this.props.onRequestAddItem();
  }

  onOpenSimulateLocation() {
    this.props.onRequestSimulateLocation();
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
    window.scrollTo(0, 0);
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
    logRateForm.debug(`render RateForm: (item=${this.state.item}, location=${this.state.location})`);
    const formReadyForSubmit = this.state.item && this.state.location && this.state.markOverall;
    return (
      <div className="standard-container">
        <h3 className="mb-4">Rate your plate!</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <SelectItemPlus
            title="What"
            kinds={this.props.kinds.kinds}
            categories={this.props.categories.categories}
            items={this.props.items.items}
            defaultItem={this.props.items.defaultItem}
            onChangeItem={this.onChangeItem.bind(this)}
            onAddItem={this.onOpenAddItem.bind(this)}
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />

          <div className="mt-4 form-block dimmed">
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
                    <SimpleListOrDropdown items={this.props.places.places} selectedOption={this.state.location} onChange={this.onChangeLocation.bind(this)} dropdown />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} sm={4} >
                    <Button block color="secondary" size="sm" onClick={this.toggleType.bind(this)}><MdStore className="mr-2" size={24} /> Type</Button>
                  </Col>
                  <Col xs={6} sm={4} className="pl-0">
                    <Button block color="secondary" size="sm" onClick={this.onOpenSimulateLocation.bind(this)}><MdMap className="mr-2" size={24} /> Map</Button>
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


          <div className="mt-4 form-block dimmed">
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
                <Row>
                  <Col xs={6} sm={4} >
                    <Button block color="secondary" size="sm" onClick={this.toggleMarks.bind(this)}><MdStore className="mr-2" size={24} /> Details</Button>
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



          <div className="mt-4 form-block dimmed">
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

          <div className="mt-4 dimmed">
            <Button color="primary" type="submit" size="md" disabled={!formReadyForSubmit}>Add</Button>
            <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
          </div>

          <div className="semi-opaque" />

        </Form>
      </div>
    );
  }
}

export default RateForm;
