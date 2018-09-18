/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';


class CheckoutComplete extends React.Component {
  render() {
    return (
      <div>
        <div className="homepage-container">
          <div className="homepage-feature-items" style={{ maxWidth: '100rem' }}>
            <h5 className="mb-3">
              <MdDone size={64} className="mr-2" />
              <FormattedMessage id="checkout.ok.title" />
            </h5>
            <p>
              <FormattedMessage id="checkout.ok.sub_title" />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutComplete;