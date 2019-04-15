import React, { Component } from 'react';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';

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
            .on('transactionHash', () => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', () => {
                this.setState({
                    message: 'Transaction has been mined',
                });
                this.props.getUserEthBalance();
                this.props.getUserContractEthBalance();
            })
            .on('confirmation', () => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
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
            .on('transactionHash', () => {
                this.setState({
                    message: 'Transaction pending...',
                });
            })
            .on('receipt', () => {
                this.setState({
                    message: 'Transaction has been mined',
                });
                this.props.getUserEthBalance();
                this.props.getUserTokenBalance();
                this.props.getUserContractTokenBalance();
            })
            .on('confirmation', () => {
                this.setState({
                    message: 'Transaction confirmed!',
                });
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
            <Container>
                <Form onSubmit = { this.submitFormEth }>
                   <Form.Label> Amount in ETH </Form.Label>
                     <InputGroup>
                        <Form.Control
                            value = { this.state.ethValue }
                            onChange = { event => this.setState({ ethValue: event.target.value }) }
                            type="number"
                            min = {0}
                        />
                        <InputGroup.Append>
                            <Button variant = "outline-secondary" type = "submit"> Withdraw </Button>
                        </InputGroup.Append>
                     </InputGroup>
                </Form>
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
                           <Button variant = "outline-secondary" type = "submit"> Withdraw </Button>
                       </InputGroup.Append>
                    </InputGroup>
                </Form>
            </Container>
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
    { getUserEthBalance, getUserTokenBalance, getUserContractEthBalance, getUserContractTokenBalance })(Withdraw);
