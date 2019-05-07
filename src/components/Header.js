import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem } from '@material-ui/core';

import { connect } from 'react-redux';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTokenName: ''
        };
    }

    handleChange = event => {
        this.setState({ selectedTokenName: event.target.value });
    }

    render() {
        const { userAccount, tokens } = this.props;
        return (
            <AppBar position = 'static' color = 'default'>
                <Toolbar>
                    <Typography variant = 'h6' color = 'inherit'>
                        MyExchange
                    </Typography>

                    <Select
                        value = { this.state.selectedTokenName }
                        onChange = { this.handleChange }
                        name = 'token'
                        displayEmpty
                    >
                        <MenuItem value = "" disabled>
                            <em> None </em>
                        </MenuItem>
                        { tokens.map( token =>
                            <MenuItem key = { token.address } value = { token }> { token.symbol } </MenuItem>
                        )}
                    </Select>

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
    tokens: state.tokens.tokenList
});

export default connect(mapStateToProps)(Header);
