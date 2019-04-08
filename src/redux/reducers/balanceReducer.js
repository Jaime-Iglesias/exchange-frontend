const initialState = {
    userEthBalance: -1,
    userTokenBalance: -1,
    userEthContractBalance: -1,
    userTokenContractBalance: -1
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ETH_BALANCE:
            return {
            };
        case: GET_TOKEN_BALANCE:
            return {
            };
        case: GET_ETH_CONTRACT_BALANCE:
            return {
            };
        case: GET_TOKEN_CONTRACT_BALANCE:
            return {
            };
        default:
            return state;
    }
}
