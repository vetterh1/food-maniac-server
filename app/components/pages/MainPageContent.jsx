import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button, Container, Col, Row } from 'reactstrap';
import MdStarHalf from 'react-icons/lib/md/star-half';
import MdStars from 'react-icons/lib/md/stars';
import MdMap from 'react-icons/lib/md/map';
import MdRestaurantMenu from 'react-icons/lib/md/restaurant-menu';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';

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
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2>Rate</h2>
            <p>Give stars to the pizza you are currently eating!</p>
            <p><Link className="btn btn-secondary" to="/rate">Rate a dish &raquo;</Link></p>
          </div>
          <div className="col-md-4">
            <h2>Search</h2>
            <p>Find the best burger around you...</p>
            <p><Link className="btn btn-secondary" to="/searchItem">Search for a dish &raquo;</Link></p>
          </div>
          <div className="col-md-4">
            <h2>Check</h2>
            <p>Find what&apos;s best here?</p>
            <p><Link className="btn btn-secondary" to="/searchItem">Check a place &raquo;</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

/*

      <Container fluid>
        <Row>
          <Col className="md-4" >
            <h2>Rate</h2>
            <p>Give stars to the pizza you are currently eating!</p>
          </Col>
          <Col className="md-4" >
            <h2>Search</h2>
            <p>Find the best burger around you...</p>
          </Col>
          <Col className="md-4" >
            <h2>Check</h2>
            <p>Find what&apos;s best here?</p>
          </Col>
        </Row>
      </Container>
*/

export default MainPageContent;
