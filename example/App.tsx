import { decomposeStore } from '../src/index';
import * as React from 'react';
import { Dispatch } from 'redux';
import AnotherPage from './AnotherPage';
import Page from './Page';
import { Values, ReduxState, SubscriptionToFormValues } from './types';

type Props = {
    dispatch: Dispatch<ReduxState>,
    pageDate$: SubscriptionToFormValues
}

const decomposer = decomposeStore({
    pageDate$: (state: ReduxState) => state.cardUserData
});

const App = decomposer<Props, 'pageDate$'>(class App extends React.Component<Props, { values: Values }> {
    state = { values: {} }

    changeAnotherForm = (values: Values) => {
        this.setState({ values });
    };

    render() {
        return <div>
            <AnotherPage onChange={this.changeAnotherForm} values={this.state.values} />
            <Page type={'user'} pageDate$={this.props.pageDate$} dispatch={this.props.dispatch} />
        </div>;
    }
})

export default App;