import React, { Component } from 'react';
import {Row, Col, Container, Form, Button, Table, Tabs, Tab, InputGroup } from 'react-bootstrap';

class DepositWithdraw extends Component {
    constructor(props) {
        super(props);

        this.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

        this.state = {
            userBalanceInContract: -1,
            userTokenBalance: -1,
            tokenBalanceInContract: -1,
            key: "deposit",
            ethValue: 0,
            tokenValue: 0,
            message: '',
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

    async deposit(amount) {
        try{
            const amountWei = this.props.web3.utils.toWei(String(amount), 'ether');
            await this.props.exchangeContract.methods.deposit().send( {
                gas: 250000,
                from: this.props.userAccount,
                value: amountWei
            })
            .on('transactionHash', () => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', () => {
                this.setState({
                    message: 'Transaction has been mined',
                });
            })
            .on('confirmation', () => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
            })
            .on('error', (err) => {
                this.setState({
                    message: err.message,
                });
            });
            this.updateUserBalance();
        } catch (err) {
            console.log(err);
        }
    }

    async approveContract(amount) {
        try {
            await this.props.tokenContract.methods.approve(this.props.exchangeContract.options.address, amount).send( {
                from: this.props.userAccount
            });
        } catch (err) {
            console.log(err);
        }
    }

    async depositToken(tokenAddress, amount) {
        try{
            this.approveContract(amount);
            await this.props.exchangeContract.methods.depositToken(tokenAddress, amount).send( {
                gas: 250000,
                from: this.props.userAccount
            })
            .on('transactionHash', () => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', () => {
                this.setState({
                    message: 'Transaction has been mined',
                });
            })
            .on('confirmation', () => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
            })
            .on('error', (err) => {
                this.setState({
                    message: err.message,
                });
            });
            this.updateUserTokenBalance(tokenAddress);
        } catch (err) {
            console.log(err);
        }
    }

    async withdraw(amount) {
        try{
            const amountWei = this.props.web3.utils.toWei(String(amount), 'ether');
            await this.props.exchangeContract.methods.withdraw(amountWei).send( {
                from: this.props.userAccount
            })
            .on('transactionHash', () => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', () => {
                this.setState({
                    message: 'Transaction has been mined',
                });
            })
            .on('confirmation', () => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
            })
            .on('error', (err) => {
                this.setState({
                    message: err.message,
                });
            });
            this.updateUserBalance();
        } catch (err) {
            console.log(err);
        }
    }

    async withdrawToken(tokenAddress, amount) {
        try{
            await this.props.exchangeContract.methods.withdrawToken(tokenAddress, amount).send({
                from: this.props.userAccount
            })
            .on('transactionHash', () => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', () => {
                this.setState({
                    message: 'Transaction has been mined',
                });
            })
            .on('confirmation', () => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
            })
            .on('error', (err) => {
                this.setState({
                    message: err.message,
                });
            });
            this.updateUserTokenBalance(tokenAddress);
        } catch (err) {
            console.log(err);
        }
    }

    async updateUserBalance() {
        this.getUserBalanceInContract(this.ZERO_ADDRESS);
    }

    async updateUserTokenBalance(tokenAddress) {
        this.getWalletTokenBalance();
        this.getUserBalanceInContract(tokenAddress);
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

     submitFormTokens = (e) => {
        e.preventDefault();

        if (this.state.key === "deposit") {
            this.depositToken(this.props.tokenContract.options.address, this.state.tokenValue);
        } else {
            this.withdrawToken(this.props.tokenContract.options.address, this.state.tokenValue);
        }

        this.setState({
            tokenValue: 0,
        });
     }

     renderDepositWithdrawTokens() {
         return(
             <Form onSubmit = { this.submitFormTokens }>
                <Form.Label> Amount in Tokens </Form.Label>
                 <InputGroup>
                    <Form.Control
                        value = { this.state.tokenValue }
                        onChange = { event => this.setState({ tokenValue: event.target.value }) }
                        type="number"
                        min = {0}
                    />
                    <InputGroup.Append>
                        <Button variant = "outline-secondary" type = "submit"> { this.state.key } </Button>
                    </InputGroup.Append>
                 </InputGroup>
            </Form>
         );
     }

     submitFormEth = (e) => {
        e.preventDefault();

        if (this.state.key === "deposit") {
            this.deposit(this.state.ethValue);
        } else {
            this.withdraw(this.state.ethValue);
        }

        this.setState({
            ethValue: 0,
        });
     }

     renderDepsositWithdrawEth() {
         return(
             <Form onSubmit = { this.submitFormEth }>
                <Form.Label> Amount in ETH </Form.Label>
                 <InputGroup>
                    <Form.Control
                        value = { this.state.ethValue }
                        onChange = { event => this.setState({ ethValue: event.target.value }) }
                        type="number"
                        min = {0}
                        placeholder="enter amount of ETH to deposit"
                    />
                    <InputGroup.Append>
                        <Button variant = "outline-secondary" type = "submit"> { this.state.key } </Button>
                    </InputGroup.Append>
                 </InputGroup>
            </Form>
         );
     }

    render() {
        return(
            <Container fluid>
                <Tabs activeKey = { this.state.key } onSelect = { key => this.setState({ key }) }>
                    <Tab display = 'inline' eventKey = 'deposit' title = 'deposit'>
                        { this.renderUserBalances() }
                        <Row>
                            <Col md = "auto"> { this.renderDepsositWithdrawEth() } </Col>
                            <Col md = "auto"> { this.renderDepositWithdrawTokens() } </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey = 'withdraw' title = 'withdraw'>
                        { this.renderUserBalances() }
                        <Row>
                            <Col md = "auto"> { this.renderDepsositWithdrawEth() } </Col>
                            <Col md = "auto"> { this.renderDepositWithdrawTokens() } </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default DepositWithdraw;
