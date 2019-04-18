import React, { Component } from 'react';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';

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

        this.approveContract(this.state.tokenValue);
        this.depositToken(this.props.tokenContract.options.address, this.state.tokenValue);

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
                            <Button variant = "outline-secondary" type = "submit"> Deposit </Button>
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
                           <Button variant = "outline-secondary" type = "submit"> Deposit </Button>
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
    { getUserEthBalance, getUserTokenBalance, getUserContractEthBalance, getUserContractTokenBalance })(Deposit);
