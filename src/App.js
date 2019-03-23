import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Header from "./components/Header";
import DepositWithdraw from './components/DepositWithdraw';
import TxHistory from './components/TxHistory';

class App extends Component {

    constructor(props){
        super(props);

        /*setInterval( () => {
            console.log(this.props.web3)
        }, 5000);*/
    }

    renderApp() {
        //console.log(this.props);
        return(
            <div>
                <Header/>
                <Container>
                    <Row>
                        <Col> <p> Your account: { this.props.userAccount } </p> </Col>
                        <Col> <p> Your balance: { this.props.userBalance } </p> </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DepositWithdraw
                                web3 = { this.props.web3 }
                                userAccount = { this.props.userAccount }
                                userBalance = { this.props.userBalance }
                                exchangeContract = { this.props.exchangeContract }
                                tokenContract = { this.props.tokenContract }
                            />
                            <TxHistory
                                userAccount = { this.props.userAccount }
                                exchangeContract = { this.props.exchangeContract }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    render() {
        return(
          <div> { this.renderApp() } </div>
      );
    }
}

export default App;
