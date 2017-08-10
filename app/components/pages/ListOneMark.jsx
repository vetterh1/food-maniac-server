/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'reactstrap';
import MdDirections from 'react-icons/lib/md/directions';
import MdRateReview from 'react-icons/lib/md/rate-review';
import RatingStars from '../utils/RatingStars';
import ListOneIndividualMark from './ListOneIndividualMark';


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

    return (
      <Row className="result-item-block py-3" noGutters>
        <Col xs={8} sm={6}>
          <Row className="result-item-name" noGutters>
            <h6>{name}</h6>
          </Row>
          <Row className="result-item-rate" noGutters>
            <Col xs={12} sm={6}>
              <RatingStars initialRate={markAggregate.markOverall} size={20} className="mr-2 mb-1" />
              <Button block color="secondary" size="sm" className="mr-2" onClick={this.toggleIndividualMarks.bind(this)}>
                {roundTo0dot5(markAggregate.markOverall)} ({markAggregate.nbMarksOverall} reviews)
              </Button>
            </Col>
          </Row>
          <Row className="result-item-location mt-1 mr-2" noGutters>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Button block color="secondary" size="sm" className="result-item-location">
                <MdDirections className="mr-2" size={18} />
                {markAggregate.distanceFormated}
              </Button>
            </a>
          </Row>
          <Row className="result-item-location mt-1" noGutters>
            {this.state.showIndividualMarks && this.props.markIndividuals.length > 0 &&
              <div className="mt-0">
                <h6 className="mb-0"><MdRateReview size={18} className="mr-2" /> Individual marks:</h6>
                {this.props.markIndividuals.map((markIndividual) => {
                  return (<ListOneIndividualMark
                    markIndividual={markIndividual}
                  />);
                })
                }
              </div>
            }
          </Row>
        </Col>
        <Col xs={4} sm={6}>
          {markAggregate.place.googlePhotoUrl && <img src={markAggregate.place.googlePhotoUrl} alt="" className="result-item-picture" />}
        </Col>
      </Row>
    );
  }

}

ListOneMark.defaultProps = { markIndividuals: [] };
