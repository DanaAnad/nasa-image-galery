import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './components/searchPage/searchPage';
import ShowPage from './components/showPage/showPage';

function App() {
  return (
    <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route exact path="/" Component={SearchPage}/>
            <Route path="/:id" Component={ShowPage}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
