import React, { Component } from 'react';
import { Row, Col, Container, Card, Table, Tabs, Tab } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';

import Deposit from './Deposit';
import Withdraw from './Withdraw';

class Funds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            key: "deposit",
        };
    }

    componentDidMount() {
        this.props.getUserEthBalance();
        this.props.getUserTokenBalance();
        this.props.getUserContractEthBalance();
        this.props.getUserContractTokenBalance();
    }

    renderUserBalances() {
        const { userEthBalance, userEthContractBalance, userTokenBalance, userTokenContractBalance  } = this.props;
        return(
            <Table size="sm" responsive>
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
                        <th> { userEthBalance } </th>
                        <th> { userEthContractBalance  }</th>
                    </tr>
                    <tr>
                        <th> tokenName </th>
                        <th> { userTokenBalance } </th>
                        <th> { userTokenContractBalance }</th>
                    </tr>
                </tbody>
            </Table>
        );
     }

    render() {
        return(
            <Container fluid>
                <Card>
                    <Card.Title> My Funds </Card.Title>
                    <Card.Body>
                        <Tabs activeKey = { this.state.key } onSelect = { key => this.setState({ key }) }>
                            <Tab display = 'inline' eventKey = 'deposit' title = 'deposit'>
                                <Row>
                                    <Col>
                                        { this.renderUserBalances() }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md = "auto">
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey = 'withdraw' title = 'withdraw'>
                                <Row>
                                    <Col>
                                        { this.renderUserBalances() }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md = "auto">
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    userEthBalance: state.user.userEthBalance,
    userTokenBalance: state.user.userTokenBalance,
    userEthContractBalance: state.user.userEthContractBalance,
    userTokenContractBalance: state.user.userTokenContractBalance,
    error: state.user.error
});

export default connect(mapStateToProps, { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance })(Funds);
