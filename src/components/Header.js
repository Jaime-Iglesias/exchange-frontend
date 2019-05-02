import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem } from '@material-ui/core';

import { connect } from 'react-redux';

class Header extends Component {

/*    <Select
        value = { this.state.selectedTokenName }
        onChange = { this.handleChange }
    >
        <MenuItem value = "">
            <em> None </em>
        </MenuItem>
        { tokens.map( token =>
            <MenuItem value = { token.symbol }> { token.symbol }</MenuItem>
        )}
    </Select>
    constructor(props) {
        super(props);

        this.state = {
            selectedTokenName: ""
        };
    }

    handleChange = (event, newValue) => {
        this.setState({ selectedTokenName: newValue });
        console.log(this.state.selectedTokenName);
    }*/

    render() {
        const { userAccount, tokens } = this.props;
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
    tokens: state.tokens.tokenList
});

export default connect(mapStateToProps)(Header);
