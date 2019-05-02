import { GET_TRADEABLE_TOKENS, SET_TOKEN, TOKEN_ERROR } from './types';

export function getTokens() {
    return async function(dispatch, getState) {
        try {
            const state = getState();
            const tokens = await state.web3.exchangeContract.methods.getTokens().call( { from: state.user.userAccount });
            console.log(tokens, "tokens");
            const formatedTokens = tokens.map((token, index) => {
                const container = {};
                container.address = token;
                if (token === state.web3.zeroAddress) container.symbol = "ETH"
                else container.symbol = "TFG"
                container.tokenIndex = index + 1;
                return container;
            });
            dispatch({
                type: GET_TRADEABLE_TOKENS,
                payload: formatedTokens
            });
            dispatch({
                type: SET_TOKEN,
                payload: formatedTokens[1]
            });
        } catch (err) {
            console.log(err.message);
            dispatch({
                type: TOKEN_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}
