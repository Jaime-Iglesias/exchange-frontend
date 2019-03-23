import React, { Component } from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';

class UnlockAccount extends Component {
    render() {
        return(
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Alert dismissible variant="danger">
                          <Alert.Heading> Account locked </Alert.Heading>
                            <p> We were unable to access your account, please unlock it to continue. </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default UnlockAccount;
