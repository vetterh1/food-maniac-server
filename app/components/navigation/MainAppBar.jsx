/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'react-bootstrap';


class MainAppBar extends React.Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="faded" light toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">Food Maniac!</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/rate">Rate</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/search">Search</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/addItem">Add item</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MainAppBar;
