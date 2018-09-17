import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.scss';
import App from './App';

import { store } from './components/store';

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('app'));
