import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux/store';
import { loadWeb3 } from './redux/actions/web3Actions';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

//import CheckProvider from './components/CheckProvider';
import * as serviceWorker from './serviceWorker';

//Init web3
loadWeb3();

ReactDOM.render(
    <Provider store = { store }>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
