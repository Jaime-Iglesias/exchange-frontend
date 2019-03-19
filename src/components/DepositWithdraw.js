import React, { Component } from 'react';
import {Form, Button, Table, Tabs, Tab, InputGroup, FormControl } from 'react-bootstrap';

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

    /*componentDidUpdate () {
        this.getWalletTokenBalance();
        this.getUserBalanceInContract(this.ZERO_ADDRESS);
        this.getUserBalanceInContract(this.props.tokenContract.options.address);
    }*/

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
            const balance = await this.props.exchangeContract.methods.getUserBalanceForToken(tokenAddress).call( { from: this.props.userAccount });
            console.log(balance);
            if (tokenAddress !== this.ZERO_ADDRESS) {
                this.setState({
                    tokenBalanceInContract: balance,
                });
            } else {
                this.setState({
                    userBalanceInContract: balance,
                });
            }
            console.log(balance);
        } catch (err) {
            console.log(err);
        }
    }

    async approveContract(amount) {
        try {
            await this.props.tokenContract.methods.approve(this.props.exchangeContract.options.address, amount).send( { from: this.props.userAccount });
        } catch (err) {
            console.log(err);
        }
    }

    async depositToken(tokenAddress, amount) {
        try{
            this.approveContract(amount);
            await this.props.exchangeContract.methods.depositToken(tokenAddress, amount).send( { gas: 250000, from: this.props.userAccount })
            this.onConfirmationSuccess(tokenAddress);
            this.setState({
                message: "Transaction succeeded",
            });
        } catch (err) {
            console.log(err);
        }
    }

    /*async withdrawToken(tokenAddress, amount) {

    }*/

    async onConfirmationSuccess(tokenAddress) {
        this.getWalletTokenBalance();
        this.getUserBalanceInContract(tokenAddress);
        console.log(this.state);
    }

     renderUserBalances() {
            return(
                <Table variant="dark" size="sm" responsive>
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

     handleClick(placeholder, action) {
         if (placeholder !== "ETH") {
             if (action === "deposit") {
                 return;
             }
         } else {
             if (action === "deposit") {
                 console.log("clicked");
                 //this.depositToken(this.state.tokenContract.options.address);
                 return;
             }
         }
     }

     submitForm = (e) => {
            e.preventDefault();
            console.log(this.props.tokenContract.options.address);
            console.log(this.state.tokenValue);

            this.setState({
                message: "Waiting for confirmation...",
            });

            this.depositToken(this.props.tokenContract.options.address, this.state.tokenValue);
     }

     getAction() {
         return(
             <Form inline onSubmit = { this.submitForm }>
                <Form.Group>
                    <Form.Label> Amount in Tokens </Form.Label>
                    <Form.Control
                        value = { this.state.tokenValue }
                        onChange = { event => this.setState({ tokenValue: event.target.value }) }
                        type="text"
                        min = {0}
                        placeholder="enter amount of tokens to deposit"
                    />
                    <Button variant = "outline-secondary" type = "submit"> Deposit </Button>
                </Form.Group>
             </Form>
         );
     }

    render() {
        return(
            <Tabs activeKey={ this.state.key } onSelect={ key => this.setState({ key }) }>
                <Tab eventKey = 'deposit' title = 'deposit'>
                    { this.renderUserBalances() }
                    { this.getAction() }
                    <h1> { this.state.message } </h1>
                </Tab>
                <Tab eventKey = 'withdraw' title = 'withdraw'>
                    { this.renderUserBalances() }
                </Tab>
            </Tabs>
        );
    }
}

export default DepositWithdraw;
