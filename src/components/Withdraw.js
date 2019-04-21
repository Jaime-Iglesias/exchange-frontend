import React, { Component } from 'react';

import { TextField, Button } from '@material-ui/core';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';
import { addWithdrawEvent } from '../redux/actions/eventActions';

class Withdraw extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ethValue: 0,
            tokenValue: 0,
            message: '',
        };
    }

    async withdraw(amount) {
        try{
            const amountWei = this.props.web3Instance.utils.toWei(String(amount), 'ether');
            await this.props.exchangeContract.methods.withdraw(amountWei).send( {
                from: this.props.userAccount
            })
            .on('transactionHash', (hash) => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', (receipt) => {
                this.setState({
                    message: 'Transaction has been mined',
                });
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
                this.props.getUserEthBalance();
                this.props.getUserContractEthBalance();
                this.props.addWithdrawEvent(receipt.events.LogWithdrawToken);
            })
            .on('error', (err) => {
                if (err.message.includes("not enough balance")) {
                    this.setState({
                        message: "you do not have enough ETH to withdraw",
                    });
                } else if (err.message.includes("ERC20 transfer failed")) {
                    this.setState({
                        message: "an error occured in the token contract",
                    });
                } else {
                    this.setState({
                        message: "something went wrong, please check the transaction",
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    async withdrawToken(tokenAddress, amount) {
        try{
            await this.props.exchangeContract.methods.withdrawToken(tokenAddress, amount).send({
                from: this.props.userAccount
            })
            .on('transactionHash', (has) => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', (receipt) => {
                this.setState({
                    message: 'Transaction has been mined',
                });
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
                this.props.getUserEthBalance();
                this.props.getUserTokenBalance();
                this.props.getUserContractTokenBalance();
                this.props.addWithdrawEvent(receipt.events.LogWithdrawToken);
            })
            .on('error', (err) => {
                if (err.message.includes("address cannot be the 0 address")) {
                    this.setState({
                        message: "token address cannot be the 0 address",
                    });
                } else if (err.message.includes("not enough balance")) {
                    this.setState({
                        message: "You do not have enough tokens to withdraw",
                    });
                } else if (err.message.includes("ERC-20 transfer failed")) {
                    this.setState({
                        message: "an error occured in the token contract",
                    });
                } else {
                    this.setState({
                        message: "something went wrong, please check the transaction",
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    submitFormEth = (e) => {
        e.preventDefault();

        this.withdraw(this.state.ethValue);

        this.setState({
            ethValue: 0,
        });

    }

    submitFormTokens = (e) => {
        e.preventDefault();

        this.withdrawToken(this.props.tokenContract.options.address, this.state.tokenValue);

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
                    <Button variant="contained" color="primary" type = 'submit'> Withdraw </Button>
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
                    <Button variant="contained" color="primary" type = 'submit'> Withdraw </Button>
                </form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    tokenContract: state.web3.tokenContract,
    userAccount: state.user.userAccount,
    error: state.user.error
});

export default connect(
    mapStateToProps,
    { getUserEthBalance, getUserTokenBalance, getUserContractEthBalance, getUserContractTokenBalance, addWithdrawEvent })(Withdraw);
