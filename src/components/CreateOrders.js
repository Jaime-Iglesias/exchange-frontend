import React, { Component } from 'react';

import { Grid, TextField, Button, Card, CardHeader, CardContent, IconButton } from '@material-ui/core';

import { MdCached } from 'react-icons/md';

import IERC20 from '../contracts/IERC20.json';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';

class CreateOrders extends Component {
    constructor(props){
        super(props);

        this.state = {
            ethValueBuy: 0,
            ethValueSell: 0,
            amountTokensBuy: 0,
            amountTokensSell: 0,
            msgValue: 0,
            approveAmount: 0
        };
    }

    async placeOrder(tokenHaveAddress, amountHave, tokenWantAddress, amountWant, msgValue) {
        const { web3Instance, userAccount, exchangeContract } = this.props;
        try {
            await exchangeContract.methods.placeOrder(tokenHaveAddress, amountHave, tokenWantAddress, amountWant).send({
                from: userAccount,
                value: msgValue
            })
            .on('transactionHash', (hash) => {
                //update eth balance
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.props.getUserEthBalance();
                this.props.getUserContractEthBalance();
                this.props.getUserTokenBalance();
                this.props.getUserContractTokenBalance();
                console.log('confirmation', confirmationNumber, receipt);
                /*if (confirmationNumber === 4) {
                    //add order to orderList
                }*/
            })
            .on('receipt', (receipt) => {
                //do something with receipt
                //console.log(receipt);
            });
        } catch (err) {
            console.log(err);
        }
    }

    submitFormBuy = (e) => {
       e.preventDefault();

       const { token, zeroAddress } = this.props;
       const { amountTokensBuy, ethValueBuy } = this.state;
       const amountEthBuyEth = ethValueBuy * amountTokensBuy;
       const amountEthBuyWei = this.props.web3Instance.utils.toWei(String(amountEthBuyEth), 'ether');

       this.placeOrder(
           zeroAddress,
           amountEthBuyWei,
           token.address,
           amountTokensBuy,
           0
       );

       this.setState({
           ethValueBuy: 0,
           amountTokensBuy: 0,
           msgValue: 0
       });

       //console.log("submit!");
    }

    resetFormBuy = (e) => {
        this.setState({
            ethValueBuy: 0,
            amountTokensBuy: 0,
            msgValue: 0
        });
    }

    renderBuyOrder() {
        return(
            <form onSubmit = { this.submitFormBuy }>
                <TextField
                    label = 'Price (ETH)'
                    required
                    value = { this.state.ethValueBuy }
                    onChange = { event => this.setState({ ethValueBuy: event.target.value }) }
                    type = 'number'
                    inputProps = {{ min: '0' }}
                />
                <br />
                <TextField
                    label = 'Amount (Tokens)'
                    required
                    value = { this.state.amountTokensBuy }
                    onChange = { event => this.setState({ amountTokensBuy: event.target.value }) }
                    type = 'number'
                    inputProps = {{ min: '0' }}
                />
                <br />
                <TextField
                    label = 'Amount (eth)'
                    value = { this.state.msgValue }
                    onChange = { event => this.setState({ msgValue: event.target.value }) }
                    type = 'number'
                    inputProps = {{ min: '0' }}
                />
                <br />
                <TextField
                    label = 'Total'
                    disabled
                    value = { this.state.ethValueBuy * this.state.amountTokensBuy }
                    type = 'number'
                />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    type = 'submit'
                >
                    Buy
                </Button>
            </form>
        );
    }

    async approve(amount) {
        const { web3Instance, token, exchangeContract, userAccount } = this.props;
        try {
            const tokenContract = new web3Instance.eth.Contract(IERC20.abi, token.address);
            await tokenContract.methods.approve(exchangeContract.options.address, amount).send({
                from: userAccount
            });

        } catch (err) {
            console.log(err);
        }
    }

    submitFormSell = (e) => {
       e.preventDefault();

       const { token, zeroAddress } = this.props;
       const { amountTokensSell, ethValueSell, approveAmount } = this.state;
       const amountEthSell = amountTokensSell * ethValueSell;
       const amountEhValue = this.props.web3Instance.utils.toWei(String(amountEthSell), 'ether');

       if (approveAmount !== 0) {
           this.approve(approveAmount);
       }

       this.placeOrder(
           token.address,
           amountTokensSell,
           zeroAddress,
           amountEthSell,
           0
       );

       this.setState({
           ethValueSell: 0,
           amountTokensSell: 0,
           approveAmount: 0
       });
    }

    resetFormSell = (e) => {
        this.setState({
            ethValueSell: 0,
            amountTokensSell: 0,
            approveAmount: 0
        });
    }

    renderSellOrder() {
        return(
            <form onSubmit = { this.submitFormSell }>
                <TextField
                    label = 'Price (ETH)'
                    required
                    value = { this.state.ethValueSell }
                    onChange = { event => this.setState({ ethValueSell: event.target.value }) }
                    type = 'number'
                    inputProps = {{ min: '0' }}
                />
                <br />
                <TextField
                    label = 'Amount (Tokens)'
                    required
                    value = { this.state.amountTokensSell }
                    onChange = { event => this.setState({ amountTokensSell: event.target.value }) }
                    type = 'number'
                    inputProps = {{ min: '0' }}
                />
                <br />
                <TextField
                    label = 'Approve amount (Tokens)'
                    value = { this.state.approveAmount }
                    onChange = { event => this.setState({ approveAmount: event.target.value }) }
                    type = 'number'
                    inputProps = {{ min: '0' }}
                />
                <br />
                <TextField
                    label = 'Total'
                    disabled
                    value = { this.state.ethValueSell * this.state.amountTokensSell }
                    type = 'number'
                />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    type = 'submit'
                >
                    Sell
                </Button>
            </form>
        );
    }

    render() {
        return(
            <Grid container spacing = { 8 } direction = 'row' alignItems = 'center'>
                <Grid item>
                    <Card raised>
                        <CardHeader
                            title = 'buy'
                            action = {
                                <IconButton  onClick = { this.resetFormBuy }>
                                    <MdCached/>
                                </IconButton>
                            }
                        >
                        </CardHeader>
                        <CardContent>
                            { this.renderBuyOrder() }
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card raised>
                        <CardHeader
                            title = 'sell'
                            action = {
                                <IconButton onClick = { this.resetFormSell }>
                                    <MdCached/>
                                </IconButton>
                            }
                        >
                        </CardHeader>
                        <CardContent>
                            { this.renderSellOrder() }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    token: state.tokens.selectedToken,
    zeroAddress: state.web3.zeroAddress,
    userAccount: state.user.userAccount,
});

export default connect(
    mapStateToProps,
    { getUserEthBalance, getUserTokenBalance, getUserContractEthBalance, getUserContractTokenBalance })(CreateOrders);
