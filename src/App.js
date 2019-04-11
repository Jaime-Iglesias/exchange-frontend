import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getWeb3 } from './redux/actions/web3Actions';
import { getAccount } from './redux/actions/userActions';

import Header from './components/Header';
import Funds from './components/Funds';

class App extends Component {

    componentDidMount() {
        this.props.getWeb3()
        .then(() => this.props.getAccount());
    }

    render() {
        const { isLoading, isLoaded, userAccount, error } = this.props;
        return(
            <div>
                { isLoading && <div className="spinner-border"/> }
                { isLoaded && userAccount !== '' &&
                    <div>
                        <Header/>
                        <Container>
                            <Row>
                                <Funds/>
                            </Row>
                        </Container>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.web3.isLoading,
    isLoaded: state.web3.isLoaded,
    error: state.web3.error,
    userAccount: state.user.userAccount
});

export default connect(mapStateToProps, { getWeb3, getAccount })(App);
