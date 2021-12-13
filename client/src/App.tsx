import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Games from "./routes/Games/Games";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route index element={<Games />} />
            </Routes>
        </div>
    );
}

export default App;
