import React, { Component } from 'react';

import { Table, TableHead, TableBody, TableRow,
         TableCell, Card, CardContent, CardHeader,
         Grid } from '@material-ui/core';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';

import Deposit from './Deposit';
import Withdraw from './Withdraw';

class Funds extends Component {

    async componentDidMount() {
        await this.props.getUserEthBalance();
        await this.props.getUserTokenBalance();
        await this.props.getUserContractEthBalance();
        await this.props.getUserContractTokenBalance();
    }

    render() {
        const { userEthBalance, userEthContractBalance, userTokenBalance, userTokenContractBalance, token  } = this.props;
        return(
            <Grid item>
                <Card raised>
                    <CardHeader title = 'My funds' />
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align = 'left'> Currency </TableCell>
                                    <TableCell align = 'left'> Wallet </TableCell>
                                    <TableCell align = 'left'> Contract </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align = 'left'> ETH </TableCell>
                                    <TableCell align = 'left'> { userEthBalance } </TableCell>
                                    <TableCell align = 'left'> { userEthContractBalance.available }({ userEthContractBalance.locked }) </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align = 'left'> { token.symbol } </TableCell>
                                    <TableCell align = 'left'> { userTokenBalance } </TableCell>
                                    <TableCell align = 'left'> { userTokenContractBalance.available }({ userTokenContractBalance.locked }) </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Grid container spacing = { 24 }>
                            <Grid item>
                                <Deposit />
                            </Grid>
                            <Grid item>
                                <Withdraw />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    userEthBalance: state.user.userEthBalance,
    userTokenBalance: state.user.userTokenBalance,
    userEthContractBalance: state.user.userEthContractBalance,
    userTokenContractBalance: state.user.userTokenContractBalance,
    token: state.tokens.selectedToken,
    error: state.user.error
});

export default connect(mapStateToProps,
    { getUserEthBalance, getUserTokenBalance, getUserContractEthBalance, getUserContractTokenBalance })(Funds);
