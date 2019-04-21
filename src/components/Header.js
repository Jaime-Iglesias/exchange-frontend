import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import { connect } from 'react-redux';

/*
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
    <Navbar.Text className="justify-content-end"> { userAccount } </Navbar.Text>
</Navbar>
*/
class Header extends Component {

    render() {
        const { userAccount } = this.props;
        return (
            <AppBar position = 'static' color = 'default'>
                <Toolbar>
                    <Typography variant = 'h6' color = 'inherit'>
                        MyExchange
                    </Typography>
                    <Typography variant = 'subtitle2' color = 'inherit'>
                        { userAccount }
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = state => ({
    userAccount: state.user.userAccount,
});

export default connect(mapStateToProps)(Header);
