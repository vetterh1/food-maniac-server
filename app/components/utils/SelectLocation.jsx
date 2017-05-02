import * as log from 'loglevel';
import React, { /* Component */ } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Col, FormGroup } from 'reactstrap';
import ReactFormInput from '../utils/ReactFormInput';

const logSelectLocation = log.getLogger('loggerSelectLocation');
logSelectLocation.setLevel('trace');
logSelectLocation.debug('--> entering SelectLocation.jsx');

const Listing = ({ places }) => {
  logSelectLocation.debug('   {   Listing.render (lr)');
  logSelectLocation.debug('          (lr) nb places: ', places.length);
  if (places.length > 0) logSelectLocation.debug('          (lr) 1st places: ', places[0].name);

  const result = (
    <Field name="location" component={ReactFormInput} type="select" size="md">
      {places && places.map((p) => { return (<option key={p.id} value={p.id}>{p.name}</option>); })}
    </Field>
  );

  logSelectLocation.debug('   }   Listing.render');
  return result;
};



class SelectLocation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      places: props.places,
    };
  }



  // 2nd to receive store changes
  componentWillReceiveProps(nextProps) {
    logSelectLocation.debug('{   SelectLocation.componentWillReceiveProps (sl-cwrp)');
    logSelectLocation.debug('       (sl-cwrp) nextProps: ', nextProps);

    if (!nextProps) {
      logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps: nextProps null !!!');
      return;
    }

    if (!nextProps.places) {
      logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps: places null !!!');
      return;
    }

    this.setState({
      places: nextProps.places,
    });

    logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps');
  }




  render() {
    logSelectLocation.debug('{   SelectLocation.render (slr)');
    logSelectLocation.debug('       (slr) state:', this.state);
    logSelectLocation.debug('       (slr) props:', this.props);

    const result = (
      <div>
        <FormGroup row className="no-gutters">
          <Col xs={12}>
            <Listing
              places={this.state.places}
            />
          </Col>
        </FormGroup>
      </div>
    );
    logSelectLocation.debug('}   SelectLocation.render');
    return result;
  }
}



SelectLocation.propTypes = {
  places: PropTypes.array.isRequired,
};


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = (state) => {
  // logSelectLocation.debug('mapStateToProps');
  return { places: state.places.places };
};

export default connect(mapStateToProps)(SelectLocation);
