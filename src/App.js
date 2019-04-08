import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import Header from "./components/Header";
import DepositWithdraw from './components/DepositWithdraw';
import TxHistory from './components/TxHistory';
import CreateOrders from './components/CreateOrders';

class App extends Component {

    render() {
        return(
            <div>
                <Header/>
                <Container>
                    <Row>
                        <Col> <p> Your account: { console.log(1) } </p> </Col>
                        <Col> <p> Your balance: { console.log(this.props.web3) } </p> </Col>
                    </Row>

                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    web3: state.web3.web3Instance,
    userAddress: state.web3.userAddress,
    networkId: state.web3.networkId
});

export default App;
