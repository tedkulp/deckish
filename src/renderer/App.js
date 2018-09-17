import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.scss';
import Grid from './components/Grid/Grid';

class App extends Component {
    render() {
        return (
            <div className="App">
                <CssBaseline />
                <Grid />
            </div>
        );
    }
}

export default App;
