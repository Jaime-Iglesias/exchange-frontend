import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import Header from "./components/Header";
import DepositWithdraw from './components/DepositWithdraw';
import TxHistory from './components/TxHistory';
import CreateOrders from './components/CreateOrders';

class App extends Component {
    render() {
        console.log('render', this.props);
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
    web3Instance: state.web3.web3Instance,
});

export default connect(mapStateToProps)(App);
