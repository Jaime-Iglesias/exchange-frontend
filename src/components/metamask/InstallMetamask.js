import React, { Component } from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';

class InstallMetamask extends Component {
    render() {
        return(
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Alert dismissible variant="danger">
                          <Alert.Heading> No Metamask plugin availabe </Alert.Heading>
                            <p> We were unable to detect Metamask in your computer, please install it. </p>
                            <p> If you have it already installed, please grant us access to your account. </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default InstallMetamask;
