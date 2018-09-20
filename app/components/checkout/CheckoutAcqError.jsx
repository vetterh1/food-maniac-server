/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { MdError } from 'react-icons/md';


class CheckoutAcqError extends React.Component {
  render() {
    return (
      <div>
        <div className="homepage-container">
          <div className="homepage-feature-items" style={{ maxWidth: '100rem' }}>
            <h5 className="mb-3">
              <MdError size={64} className="mr-2" />
              <FormattedMessage id="checkout.ko.acq.title" />
            </h5>
            <p>
              <FormattedMessage id="checkout.ko.acq.sub_title" />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutAcqError;