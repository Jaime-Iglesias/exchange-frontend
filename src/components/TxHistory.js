import React, { Component } from 'react';

class TxHistory extends Component {

    constructor(props){
        super(props);

        this.state = {
            eventList: [],
        };
    }

    componentDidMount() {
        this.depositListener();
        this.withdrawListener();
    }

    depositListener() {
        this.props.exchangeContract.events.LogDepositToken({
            filter: this.props.userAccount
        })
        .on('data', (event) => {
            this.setState({
                eventList: this.state.eventList.concat(event),
            });
            console.log(event);
        })
        .on('changed', (event) => {
            const index = this.state.eventList.indexOf(event.transactionHash);
            if (index > -1) {
                this.state.eventList.splice(index, 1);
            }
        });
    }

    withdrawListener() {
        this.props.exchangeContract.events.LogWithdrawToken({
            filter: this.props.userAccount
        })
        .on('data', (event) => {
            this.setState({
                eventList: this.state.eventList.concat(event),
            });
        })
        .on('changed', (event) => {
            const index = this.state.eventList.indexOf(event.transactionHash);
            if (index > -1) {
                this.state.eventList.splice(index, 1);
            }
        });
    }

    renderEventList() {
    }

    render() {
        return(
            <div> {  } </div>
        );
    }
}

export default TxHistory;
