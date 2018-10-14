import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.scss';
import Main from './components/Main/Main';

class App extends Component {
    render() {
        return (
            <div className="App">
                <CssBaseline />
                <Main />
            </div>
        );
    }
}

export default App;
