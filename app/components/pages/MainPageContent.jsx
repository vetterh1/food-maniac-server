import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button, Container, Col, Row } from 'reactstrap';
import MdStarHalf from 'react-icons/lib/md/star-half';
import MdStars from 'react-icons/lib/md/stars';
import MdMap from 'react-icons/lib/md/map';
import MdRestaurantMenu from 'react-icons/lib/md/restaurant-menu';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';
import MdLocationSearching from 'react-icons/lib/md/location-searching';

const styles = {
  divStyle: {
    // background: 'url("images/pasta_alpha30_qty50.jpg") no-repeat center center fixed',
    // backgroundSize: 'cover',
  },
};

class MainPageContent extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div className="homepage-container">
        <div className="homepage-feature-items">
          <div className="homepage-feature-item">
            <a href="/rate" style={{ textDecoration: 'none' }}>
              <div className="homepage-feature-icon"><MdStarHalf size={64} /></div>
              <h5 className="homepage-feature-title">Rate</h5>
              <div className="homepage-feature-detail">
                <p>Give stars to the pizza you are currently eating!</p>
              </div>
            </a>
          </div>
          <div className="homepage-feature-item">
            <a href="/searchItem" style={{ textDecoration: 'none' }}>
              <div className="homepage-feature-icon"><MdLocationSearching size={64} /></div>
              <h5 className="homepage-feature-title">Search</h5>
              <div className="homepage-feature-detail">
                <p>Find the best burger around you...</p>
              </div>
            </a>
          </div>
          <div className="homepage-feature-item">
            <a href="/searchItem" style={{ textDecoration: 'none' }}>
              <div className="homepage-feature-icon"><MdLocalRestaurant size={64} /></div>
              <h5 className="homepage-feature-title">Check</h5>
              <div className="homepage-feature-detail">
                <p>What&apos;s best where you are?</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

/*
    Version with Bootstrap
      <div className="container homepage-container">
        <div className="row homepage-feature-items">
          <div className="col-md-4 homepage-feature-item">
            <div className="homepage-feature-icon"><MdStarHalf size={64} /></div>
            <h5 className="homepage-feature-title">Rate</h5>
            <div className="homepage-feature-detail">
              <p>Give stars to the pizza you are currently eating!</p>
            </div>
          </div>
          <div className="col-md-4 homepage-feature-item">
            <div className="homepage-feature-icon"><MdMap size={64} /></div>
            <h5 className="homepage-feature-title">Search</h5>
            <div className="homepage-feature-detail">
              <p>Find the best burger around you..</p>
            </div>
          </div>
          <div className="col-md-4 homepage-feature-item">
            <div className="homepage-feature-icon"><MdLocalRestaurant size={64} /></div>
            <h5 className="homepage-feature-title">Check</h5>
            <div className="homepage-feature-detail">
              <p>Find what&apos;s best here?</p>
            </div>
          </div>
        </div>
      </div>


              <div><Link className="btn btn-secondary" to="/rate">Rate a dish &raquo;</Link></div>
              <div><Link className="btn btn-secondary" to="/searchItem">Search for a dish &raquo;</Link></div>
              <div><Link className="btn btn-secondary" to="/searchItem">Check a place &raquo;</Link></div>

*/


export default MainPageContent;
