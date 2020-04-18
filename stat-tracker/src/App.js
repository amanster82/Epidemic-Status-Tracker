import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import External from './External';
import Report from './Report';
import Dashboard from './Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Route path='/' exact component={External} />
            <Route path='/self-report' exact component={Report} />
            <Route path='/Dashboard' exact component={Dashboard} />
        </BrowserRouter>
    );
}

export default App;