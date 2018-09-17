/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { MdStarHalf } from 'react-icons/md';
import { MdRestaurantMenu } from 'react-icons/md';
import { MdLocationSearching } from 'react-icons/md';
import Auth from '../../auth/Auth';
import LoginBanner from '../../auth/LoginBanner';

class MainPageContent extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
  }

  render() {
    const greyWhenNoAuth = this.props.auth.isAuthenticated() ? '' : 'auth-required';

    return (
      <div>
        <LoginBanner auth={this.props.auth} showWelcomeBlob />
        <div className="homepage-container">
          <div className="homepage-feature-items">
            <div className="homepage-feature-item">
              <Link to="/rate" className="" style={{ textDecoration: 'none' }}>
                <div className={`homepage-feature-icon ${greyWhenNoAuth}`}><MdStarHalf size={64} /></div>
                <h5 className={`homepage-feature-title ${greyWhenNoAuth}`}><FormattedMessage id="core.rate" /></h5>
                <div className={`homepage-feature-detail ${greyWhenNoAuth}`}>
                  <p><FormattedMessage id="messages.rate.blob" /></p>
                </div>
              </Link>
            </div>
            <div className="homepage-feature-item">
              <Link to="/search" className="" style={{ textDecoration: 'none' }}>
                <div className="homepage-feature-icon"><MdLocationSearching size={64} /></div>
                <h5 className="homepage-feature-title"><FormattedMessage id="core.search" /></h5>
                <div className="homepage-feature-detail">
                  <p><FormattedMessage id="messages.search.blob" /></p>
                </div>
              </Link>
            </div>
            <div className="homepage-feature-item">
              <Link to="/search" className="" style={{ textDecoration: 'none' }}>
                <div className="homepage-feature-icon"><MdRestaurantMenu size={64} /></div>
                <h5 className="homepage-feature-title"><FormattedMessage id="core.discover" /></h5>
                <div className="homepage-feature-detail">
                  <p><FormattedMessage id="messages.discover.blob" /></p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainPageContent;