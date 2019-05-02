import React, { Component } from 'react';

import { TextField, Button } from '@material-ui/core';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';
import { addDepositEvent } from '../redux/actions/eventActions';

class Deposit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ethValue: 0,
            tokenValue: 0,
            message: ''
        };
    }

     async deposit(amount) {
        try{
            const amountWei = this.props.web3Instance.utils.toWei(String(amount), 'ether');
            await this.props.exchangeContract.methods.deposit().send( {
                from: this.props.userAccount,
                value: amountWei
            })
            .on('transactionHash', (hash) => {
                this.setState({
                    message: 'Transaction pending...',
                });
                //notify user with pending transaction
                //console.log(this.state.message);
            })
            .on('receipt', (receipt) => {
                this.setState({
                    message: 'Transaction has been mined',
                });
                //console.log(this.state.message);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
                this.props.getUserEthBalance();
                this.props.getUserContractEthBalance();
                this.props.addDepositEvent(receipt.events.LogDepositToken);
                //console.log(this.state.message);
                /*if (confirmationNumber === 4) {
                    this.props.getUserContractEthBalance();
                }*/
            })
            .on('error', (err) => {
                this.setState({
                    message: err.message,
                });
            })
            .then((receipt) => {
                console.log('never enters here');
                this.props.getUserEthBalance();
                this.props.getUserContractEthBalance();
            });
        } catch (err) {
            console.log(err);
        }
    }

    async depositToken(tokenAddress, amount) {
        try{
            await this.props.exchangeContract.methods.depositToken(tokenAddress, amount).send( {
                from: this.props.userAccount
            })
            .on('transactionHash', (hash) => {
                this.setState({
                    message: 'Transaction pending...',
                });
                //console.log(this.state.message);
            })
            .on('receipt', (receipt) => {
                this.setState({
                    message: 'Transaction has been mined',
                });
                //console.log(this.state.message);
                this.props.getUserEthBalance();
                this.props.getUserTokenBalance();
                this.props.getUserContractTokenBalance();
                this.props.addDepositEvent(receipt.events.LogDepositToken);
                /*if (confirmationNumber === 4) {
                    this.props.getUserContractEthBalance();
                }*/
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
                //console.log(this.state.message);
            })
            .on('error', (err) => {
                if (err.message.includes("address cannot be the 0 address")) {
                    this.setState({
                        message: "token address cannot be the 0 address",
                    });
                } else if (err.message.includes("not enough allowance")) {
                    this.setState({
                        message: "You need to approve the exchange contract before the deposit",
                    });
                } else if (err.message.includes("ERC20 transfer failed")) {
                    this.setState({
                        message: "Somethin went wrong",
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

     submitFormEth = (e) => {
        e.preventDefault();

        this.deposit(this.state.ethValue);
        this.setState({
            ethValue: 0,
        });
    }

    submitFormTokens = (e) => {
        e.preventDefault();

        this.depositToken(this.props.token.address, this.state.tokenValue);

        this.setState({
            tokenValue: 0,
        });

    }

    render() {
        return(
            <React.Fragment>
                <form onSubmit = { this.submitFormEth } >
                    <TextField
                        label = 'amount in ETH'
                        value = { this.state.ethValue }
                        onChange = { event => this.setState({ ethValue: event.target.value }) }
                        required
                        type = 'number'
                        inputProps = {{ min: '0' }}
                    />
                    <Button variant="contained" color="primary" type = 'submit'> Deposit </Button>
                </form>
                <br/>
                <form onSubmit = { this.submitFormTokens } >
                    <TextField
                        label = 'amount in Tokens'
                        value = { this.state.tokenValue }
                        onChange = { event => this.setState({ tokenValue: event.target.value }) }
                        required
                        type = 'number'
                        inputProps = {{ min: '0' }}
                    />
                    <Button variant="contained" color="primary" type = 'submit'> Deposit </Button>
                </form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    token: state.tokens.selectedToken,
    userAccount: state.user.userAccount,
    error: state.user.error
});

export default connect(
    mapStateToProps,
    { getUserEthBalance, getUserTokenBalance, getUserContractEthBalance, getUserContractTokenBalance, addDepositEvent })(Deposit);
