import React, { Component } from 'react';
import { Container, Form, Button, Table, Tabs, Tab, InputGroup, FormControl } from 'react-bootstrap';

class MyExchange extends Component {
    constructor(props) {
        super(props);

        const{
            contract,
            tokenContract,
            address,
            balance,
        } = this.props;

        this.state = {
            key: 'deposit',
            contract,
            tokenContract,
            address,
            balance,
            ethBalance: 0,
            token: 0,
            tokenBalance: 0,
        };
    }

    componentDidMount(){
        this.getTokenBalance();
        this.getUserBalanceForToken(this.state.tokenContract.address);
        this.getUserBalanceForToken("0x0000000000000000000000000000000000000000");
    }


    async depositToken(tokenAddress, amount) {
        await this.state.contract.methods.depositToken(tokenAddress, amount).send( { from: this.state.address })
            .on('confirmation', function(confs, receipt) {
                console.log("NUMBER OF CONFIRMATIONS: "+confs);

                if(confs == 5) {
                    console.log('Transaction confirmed!');
                    this.onConfirmationSuccess(tokenAddress);
                    return;
                }
            })
            .on('error', (err) => {
                console.log(err.message);
            });
    }

    /*async withdrawToken(tokenAddress, amount) {

    }*/

    async onConfirmationSuccess(tokenAddress) {
        this.getTokenBalance();
        this.getUserBalanceForToken(tokenAddress);
    }

    async getTokenBalance() {
            try{
                const token = await this.state.tokenContract.methods.balanceOf(this.state.address).call();
                this.setState({
                    token,
                });
            } catch (err) {
                console.log(err);
            }
    }

    async getUserBalanceForToken(tokenAddress) {
        try {
            const balance = await this.state.contract.methods.userBalanceForToken(this.state.address, tokenAddress).call();
            if (tokenAddress !== 0) {
                this.setState({
                    tokenBalance: balance,
                });
            } else {
                this.setState({
                    ethBalance: balance,
                });
            }
        } catch (err) {
            console.log(err)
        }
    }

     getUserBalances() {
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
                            <th> { this.state.balance } </th>
                            <th> { this.state.ethBalance }</th>
                        </tr>
                        <tr>
                            <th> tokenName </th>
                            <th> { this.state.token} </th>
                            <th> { this.state.tokenBalance }</th>
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

     getAction(placeholder, action) {
         return(
             <InputGroup className="mb-3">
               <FormControl
                 placeholder = { placeholder }
                 aria-label = "Recipient's username"
                 aria-describedby = "basic-addon2"
                 type = "number"
               />
               <InputGroup.Append>
                 <Button variant = "outline-secondary" onClick = { this.handleClick(placeholder, action) }> { action } </Button>
               </InputGroup.Append>
             </InputGroup>
         );
     }

    render() {
        if (this.state.contract && this.state.tokenContract) {
            return(
                <Tabs activeKey={ this.state.key } onSelect={ key => this.setState({ key }) }>
                    <Tab eventKey = 'deposit' title = 'deposit'>
                        { this.getUserBalances() }
                        { this.getAction("ETH", "deposit") }
                        { this.getAction("tokenName", "deposit") }
                    </Tab>
                    <Tab eventKey = 'withdraw' title = 'withdraw'>
                        { this.getUserBalances() }
                        { this.getAction("ETH", "withdraw") }
                        { this.getAction("tokenName", "withdraw") }
                    </Tab>
                </Tabs>
            );
        } else{
            return;
        }
    }
}

export default MyExchange;
