import React from 'react';
import { Link } from 'react-router';
import MdStarHalf from 'react-icons/lib/md/star-half';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';
import MdLocationSearching from 'react-icons/lib/md/location-searching';

const MainPageContent = () => (
  <div>
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-6">Welcome, food lover!</h1>
        <p>This site let you share what you feel is best in your favorite restaurants and bars.
        Food-maniac focuses on the plates and not the place.
        It&apos;s then the best way to discover where to go to eat the best pizza or to drink the most amazing margarita!</p>
        <p><Link className="btn btn-primary btn-md" to="/signin">Sign-in &raquo;</Link></p>
      </div>
    </div>
    <div className="homepage-container">
      <div className="homepage-feature-items">
        <div className="homepage-feature-item">
          <Link to="/rate" className="" style={{ textDecoration: 'none' }}>
            <div className="homepage-feature-icon"><MdStarHalf size={64} /></div>
            <h5 className="homepage-feature-title">Rate</h5>
            <div className="homepage-feature-detail">
              <p>Give stars to the pizza you are currently eating!</p>
            </div>
          </Link>
        </div>
        <div className="homepage-feature-item">
          <Link to="/searchItem" className="" style={{ textDecoration: 'none' }}>
            <div className="homepage-feature-icon"><MdLocationSearching size={64} /></div>
            <h5 className="homepage-feature-title">Search</h5>
            <div className="homepage-feature-detail">
              <p>Find the best burger around you...</p>
            </div>
          </Link>
        </div>
        <div className="homepage-feature-item">
          <Link to="/searchItem" className="" style={{ textDecoration: 'none' }}>
            <div className="homepage-feature-icon"><MdLocalRestaurant size={64} /></div>
            <h5 className="homepage-feature-title">Check</h5>
            <div className="homepage-feature-detail">
              <p>What&apos;s best where you are?</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default MainPageContent;

/*
    Version with Bootstrap

// import { Button, Container, Col, Row } from 'reactstrap';
// import PropTypes from 'prop-types';
// import MdStars from 'react-icons/lib/md/stars';
// import MdMap from 'react-icons/lib/md/map';
// import MdRestaurantMenu from 'react-icons/lib/md/restaurant-menu';
    
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
