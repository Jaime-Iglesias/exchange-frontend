import {  } from '../actions/types';

const initialState = {
    userAccount: '',
    userEthBalance: -1,
    userTokenBalance: -1,
    userEthContractBalance: -1,
    userTokenContractBalance: -1
};

export default function(state = initialState, action) {
    switch(action.type) {
        default:
            return state;
    }
}
