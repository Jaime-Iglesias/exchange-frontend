import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getWeb3 } from './redux/actions/web3Actions';

import Header from "./components/Header";


class App extends Component {

    componentDidMount() {
        this.props.getWeb3();
    }

    render() {
        return(
            <div>
                <Header/>
                <Container>
                    <Row>
                        <Col> <p> Your account: {  } </p> </Col>
                        <Col> <p> Your balance: {  } </p> </Col>
                    </Row>

                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
});

export default connect(mapStateToProps, { getWeb3 })(App);
