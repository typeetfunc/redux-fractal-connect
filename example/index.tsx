import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { assocPath } from 'ramda';
import App from './App';
import { ReduxState, Action } from './types';


const reducer = (state: ReduxState, action: Action) => {
    switch (action.type) {
        case 'CHANGE_FORM_USER':
            const oldValues = state.cardUserData.formValues.user || {};
            return assocPath(
                ['cardUserData', 'formValues', 'user'],
                Object.assign({},
                    oldValues,
                    action.payload.changes
                ),
                state
            );
        default:
            throw new Error('Not implemented action');
    }
}
const store = createStore(reducer, { cardUserData: { formValues: {} } });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);