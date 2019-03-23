import React, { Component } from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';

class UnlockMetamask extends Component {
    render() {
        return(
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Alert dismissible variant="danger">
                          <Alert.Heading> Please, unlock Metamask </Alert.Heading>
                            <p> Click on Metamask and unlock it to continue. </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default UnlockMetamask;
