import * as log from 'loglevel';
import React, { /* Component */ } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const logLanguageBar = log.getLogger('loggerLanguageBar');
logLanguageBar.setLevel('debug');
logLanguageBar.debug('--> entering LanguageBar.jsx');



class LanguageBar extends React.Component {

  constructor() {
    super();

    this.state = {

    };
  }



  // 2nd to receive store changes
  componentWillReceiveProps(nextProps) {
    logLanguageBar.debug('{   LanguageBar.componentWillReceiveProps (rl-cwrp)');
    logLanguageBar.debug('       (rl-cwrp) nextProps: ', nextProps);

    if (!nextProps) {
      logLanguageBar.debug('}   LanguageBar.componentWillReceiveProps: nextProps null !!!');
      return;
    }

    if (!nextProps.languageInfo) {
      logLanguageBar.debug('}   LanguageBar.componentWillReceiveProps: languageInfo null !!!');
      return;
    }

    if (!nextProps.languageInfo.list || nextProps.languageInfo.list.length <= 0) {
      logLanguageBar.debug('}   LanguageBar.componentWillReceiveProps: languageInfo.list null or empty !!!');
      return;
    }

    if (!nextProps.languageInfo.current) {
      logLanguageBar.debug('}   LanguageBar.componentWillReceiveProps: languageInfo.current null !!!');
      return;
    }

    if (!nextProps.languageInfo.changed) {
      logLanguageBar.debug('}   LanguageBar.componentWillReceiveProps: no change in language');
      return;
    }

    // Save places in redux store
    // const { dispatch } = this.props;  // Injected by react-redux
    // const action = PlacesActions.setCurrentPlaces(resultsWithDistance);
    // dispatch(action);

    logLanguageBar.debug('}   LanguageBar.componentWillReceiveProps');
  }




  render() {
    logLanguageBar.debug('{   LanguageBar.render (rlr)');
    logLanguageBar.debug('       (rlr) state:', this.state);
    logLanguageBar.debug('       (rlr) props:', this.props);

    const result = (
      <div>
        {this.props.languageInfo.list.map((oneLanguage, index) => (
          <span key={index} onClick="alert('click!')">{oneLanguage}&nbsp;</span>
        ))}
      </div>
    );
    logLanguageBar.debug('}   LanguageBar.render');
    return result;
  }
}



LanguageBar.propTypes = {
  languageInfo: PropTypes.shape({
    list: PropTypes.array,
    current: PropTypes.number,
    changed: PropTypes.boolean,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = (state) => {
  return { languageInfo: state.languageInfo };
};

export default connect(mapStateToProps)(LanguageBar);
