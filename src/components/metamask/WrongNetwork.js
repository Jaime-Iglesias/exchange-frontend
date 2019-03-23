import React, { Component } from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';

class WrongNetwork extends Component {
    render() {
        return(
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Alert dismissible variant="danger">
                          <Alert.Heading> Wrong network, please change to a local network using Ganache. </Alert.Heading>
                            <p> Click on Metamask and change the current network. </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default WrongNetwork;
