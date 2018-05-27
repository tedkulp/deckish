import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

export function createStore(data) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const middleware = [thunk];
    const finalCreateStore = composeEnhancers(applyMiddleware(...middleware))(_createStore);
    return finalCreateStore(reducer, data);
}

export const store = createStore({});
export const dispatch = store.dispatch;
