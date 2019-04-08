import React, { Component } from 'react';
import {Row, Col, Container, Card, Table, Tabs, Tab } from 'react-bootstrap';

import Deposit from './Deposit';
import Withdraw from './Withdraw';

class DepositWithdraw extends Component {
    constructor(props) {
        super(props);

        this.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

        this.updateUserBalance = this.updateUserBalance.bind(this);

        this.state = {
            userBalanceInContract: -1,
            userTokenBalance: -1,
            tokenBalanceInContract: -1,
            key: "deposit",
        };
    }

    componentDidMount() {
        this.getWalletTokenBalance();
        this.getUserBalanceInContract(this.ZERO_ADDRESS);
        this.getUserBalanceInContract(this.props.tokenContract.options.address);
    }

    async getWalletTokenBalance() {
            try{
                const userTokenBalance = await this.props.exchangeContract.methods.balanceOf(this.props.tokenContract.options.address).call( { from: this.props.userAccount });
                this.setState({
                    userTokenBalance,
                });
            } catch (err) {
                console.log(err);
            }
    }

    async getUserBalanceInContract(tokenAddress) {
        try {
            const balanceWei = await this.props.exchangeContract.methods.getUserBalanceForToken(tokenAddress).call( { from: this.props.userAccount });
            const balance = this.props.web3.utils.fromWei(balanceWei, 'ether');
            if (tokenAddress !== this.ZERO_ADDRESS) {
                this.setState({
                    tokenBalanceInContract: balanceWei,
                });
            } else {
                this.setState({
                    userBalanceInContract: balance,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

     updateUserBalance() {
        console.log(1);
        this.getWalletTokenBalance();
        console.log(2);
        this.getUserBalanceInContract(this.ZERO_ADDRESS);
        console.log(3);
        this.getUserBalanceInContract(this.props.tokenContract.options.address);
        console.log(4);
    }

    renderUserBalances() {
        return(
            <Table size="sm" responsive>
                <thead>
                    <tr>
                        <th> Currency </th>
                        <th> in wallet </th>
                        <th> in contract </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th> ETH </th>
                        <th> { this.props.userBalance } </th>
                        <th> { this.state.userBalanceInContract }</th>
                    </tr>
                    <tr>
                        <th> tokenName </th>
                        <th> { this.state.userTokenBalance } </th>
                        <th> { this.state.tokenBalanceInContract }</th>
                    </tr>
                </tbody>
            </Table>
        );
     }

    render() {
        return(
            <Container fluid>
                <Card>
                    <Card.Title> My Funds </Card.Title>
                    <Card.Body>
                        <Tabs activeKey = { this.state.key } onSelect = { key => this.setState({ key }) }>
                            <Tab display = 'inline' eventKey = 'deposit' title = 'deposit'>
                                <Row>
                                    <Col>
                                        { this.renderUserBalances() }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md = "auto">
                                        <Deposit
                                            web3 = { this.props.web3 }
                                            userAccount = { this.props.userAccount }
                                            userBalance = { this.props.userBalance }
                                            exchangeContract = { this.props.exchangeContract }
                                            tokenContract = { this.props.tokenContract }
                                            updateBalance = { this.updateUserBalance }
                                        />
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey = 'withdraw' title = 'withdraw'>
                                <Row>
                                    <Col>
                                        { this.renderUserBalances() }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md = "auto">
                                        <Withdraw
                                            web3 = { this.props.web3 }
                                            userAccount = { this.props.userAccount }
                                            userBalance = { this.props.userBalance }
                                            exchangeContract = { this.props.exchangeContract }
                                            tokenContract = { this.props.tokenContract }
                                            updateBalance = { this.updateUserBalance }
                                        />
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default DepositWithdraw;
