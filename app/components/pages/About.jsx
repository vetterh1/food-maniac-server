/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import MdBuild from 'react-icons/lib/md/build'; // Tools
import MdBrush from 'react-icons/lib/md/brush'; // FO
import MdDns from 'react-icons/lib/md/dns'; // BO
import MdEdit from 'react-icons/lib/md/edit'; // Techniques
import MdSchool from 'react-icons/lib/md/school'; // Title

/*
FO --> ES6, React, Redux, Flex, Auth0
BO --> NodeJS, Express, Nginx, Mongo, Mongoose
Tools --> Webpack, Tests (Mocha, Jest), Eslint, Google APIs
Techniques --> multi-device layouts, Promises, TDD, Webpack optimizations
*/

class About extends React.Component {
  render() {
    return (
      <div>
        <div className="homepage-container">
          <div className="homepage-feature-items" style={{ maxWidth: '100rem' }}>
            <h5 className="mb-3">
              <MdSchool size={24} className="mr-2" />
              <FormattedMessage id="about.title" />
            </h5>
          </div>
        </div>
        <div className="homepage-container">
          <div className="homepage-feature-items" style={{ maxWidth: '100rem' }}>
            <div className="homepage-feature-item">
              <div className="homepage-feature-icon"><MdBrush size={48} /></div>
              <h5 className="homepage-feature-title"><FormattedMessage id="about.front" /></h5>
              <div className="homepage-feature-detail">
                <p><FormattedMessage id="about.front.blob" /></p>
              </div>
            </div>
            <div className="homepage-feature-item">
              <div className="homepage-feature-icon"><MdDns size={48} /></div>
              <h5 className="homepage-feature-title"><FormattedMessage id="about.back" /></h5>
              <div className="homepage-feature-detail">
                <p><FormattedMessage id="about.back.blob" /></p>
              </div>
            </div>
            <div className="homepage-feature-item">
              <div className="homepage-feature-icon"><MdBuild size={48} /></div>
              <h5 className="homepage-feature-title"><FormattedMessage id="about.tools" /></h5>
              <div className="homepage-feature-detail">
                <p><FormattedMessage id="about.tools.blob" /></p>
              </div>
            </div>
            <div className="homepage-feature-item">
              <div className="homepage-feature-icon"><MdEdit size={48} /></div>
              <h5 className="homepage-feature-title"><FormattedMessage id="about.techniques" /></h5>
              <div className="homepage-feature-detail">
                <p><FormattedMessage id="about.techniques.blob" /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;