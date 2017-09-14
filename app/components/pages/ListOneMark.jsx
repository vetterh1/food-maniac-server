/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Row } from 'reactstrap';
import MdDirections from 'react-icons/lib/md/directions';
import MdRateReview from 'react-icons/lib/md/rate-review';
import MdStarHalf from 'react-icons/lib/md/star-half';
import RatingStars from '../utils/RatingStars';
import ListOneIndividualMark from './ListOneIndividualMark';
import RatingStarsRow from '../utils/RatingStarsRow';


const logListOneMark = log.getLogger('logListOneMark');
logListOneMark.setLevel('debug');
logListOneMark.debug('--> entering ListOneMark.jsx');

// To round to the next 0.5: (Math.round(rating * 2) / 2).toFixed(1)
function roundTo0dot5(n) { return n ? (Math.round(n * 2) / 2).toFixed(1) : null; }


export default class ListOneMark extends React.Component {

  static propTypes = {
    markAggregate: PropTypes.object.isRequired,
    markIndividuals: PropTypes.array,
    onRequestIndividualMarks: PropTypes.func.isRequired,
    // index: PropTypes.number.isRequired,
    // key: PropTypes.string.isRequired,
  };



  constructor(props) {
    super(props);

    this.state = {
      showIndividualMarks: false,
    };
  }


  toggleIndividualMarks() {
    // If Individual marks are hidden, ask parent to load them
    if (!this.state.showIndividualMarks) {
      console.log('toggleIndividualMarks: call onRequestIndividualMarks', this.props.onRequestIndividualMarks);
      this.props.onRequestIndividualMarks();
    }

    this.setState({ showIndividualMarks: !this.state.showIndividualMarks });
  }

  render() {
    const { markAggregate } = this.props;
    // sanitizeHtml escapes &<>" so we need to invert this for display!
    const name = markAggregate.place.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    const googleMapsUrl = `https://www.google.com/maps/dir/Current+Location/${markAggregate.location.coordinates[1]},${markAggregate.location.coordinates[0]}`;

    const atLabel = `${this.context.intl.formatMessage({ id: 'core.at' })}...`;
    const item = markAggregate.item && typeof markAggregate.item === 'object' ? `${markAggregate.item.name} ${atLabel} ` : '';

    const foodLabel = this.context.intl.formatMessage({ id: 'core.food' });
    const valueLabel = this.context.intl.formatMessage({ id: 'core.value' });
    const placeLabel = this.context.intl.formatMessage({ id: 'core.place' });
    const staffLabel = this.context.intl.formatMessage({ id: 'core.staff' });

    return (
      <div className="result-item-block py-3" >
        <Row noGutters>
          <Col xs={8} sm={6} className="pr-3">
            <Row className="result-item-name" noGutters>
              <h6>{item}{name}</h6>
            </Row>
            <Row className="result-item-rate" noGutters>
              <RatingStars initialRate={markAggregate.markOverall} size={20} className="" />
            </Row>
            <Row className="result-item-rate mt-2" noGutters>
              <Button block color="secondary" size="sm" className="" onClick={this.toggleIndividualMarks.bind(this)}>
                {roundTo0dot5(markAggregate.markOverall)} ({markAggregate.nbMarksOverall} <FormattedMessage id="core.reviews" />)
              </Button>
            </Row>
            <Row className="result-item-location mt-2" noGutters>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <Button block color="secondary" size="sm" className="">
                  <MdDirections className="mr-2" size={18} />
                  {markAggregate.distanceFormated}
                </Button>
              </a>
            </Row>
            {this.state.showIndividualMarks &&
              <Row className="result-item-location mt-4 bordered-block" noGutters>
                <h6 className="mb-3"><MdStarHalf size={18} className="mr-2" /> <FormattedMessage id="marks.individual" />:</h6>
                <Col xs={12} className="pl-3-if-large">
                  <RatingStarsRow name="markFood" label={foodLabel} initialRate={markAggregate.markFood} quantity={markAggregate.nbMarksFood} hideIfNoQuantity size={18} />
                  <RatingStarsRow name="markValue" label={valueLabel} initialRate={markAggregate.markValue} quantity={markAggregate.nbMarksValue} hideIfNoQuantity size={18} />
                  <RatingStarsRow name="markPlace" label={placeLabel} initialRate={markAggregate.markPlace} quantity={markAggregate.nbMarksPlace} hideIfNoQuantity size={18} />
                  <RatingStarsRow name="markStaff" label={staffLabel} initialRate={markAggregate.markStaff} quantity={markAggregate.nbMarksStaff} hideIfNoQuantity size={18} />
                </Col>
              </Row>
            }
          </Col>
          <Col xs={4} sm={6} className="result-item-image">
            {markAggregate.place.googlePhotoUrl && <img src={markAggregate.place.googlePhotoUrl} alt="" className="result-item-picture" />}
          </Col>
        </Row>
        {this.state.showIndividualMarks && this.props.markIndividuals.length > 0 &&
          <Row noGutters className="result-item-location mt-4 bordered-block">
            <h6 className="mb-3"><MdRateReview size={18} className="mr-2" /> Optional Comments:</h6>
            <Col xs={12} className="pl-3">
              {this.props.markIndividuals.map((markIndividual) => {
                return (<ListOneIndividualMark
                  markIndividual={markIndividual}
                  key={markIndividual._id}
                />);
              })
              }
            </Col>
          </Row>
        }
      </div>
    );
  }

}

ListOneMark.contextTypes = { intl: React.PropTypes.object.isRequired };

ListOneMark.defaultProps = { markIndividuals: [] };
