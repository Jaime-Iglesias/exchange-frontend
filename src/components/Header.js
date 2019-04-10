import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import { connect } from 'react-redux';

class Header extends Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home"> MyExchange </Navbar.Brand>
                <Nav className="mr-auto">
                    <NavDropdown title="Tokens" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1"> Token1 </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2"> Token2 </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3"> Token3 </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.4"> Token4 </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Navbar.Text className="justify-content-end"> { this.props.userAccount } </Navbar.Text>
            </Navbar>
        );
    }
}

const mapStateToProps = state => ({
    userAccount: state.web3.userAccount,
});

export default connect(mapStateToProps)(Header);
