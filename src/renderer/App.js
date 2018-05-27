import React, { Component } from 'react';
import './App.scss';
import Grid from './components/Grid/Grid';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to This Thing</h1>
                </header>
                <div className="App-intro">
                    <Grid />
                </div>
            </div>
        );
    }
}

export default App;
