import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import SearchPage from './components/searchPage/searchPage';
import ShowPage from './components/showPage/showPage';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" Component={SearchPage}/>
            <Route path="/:id" Component={ShowPage}/>
            {/* <Route exact path="/" element={<SearchPage />} />
            <Route path="/show/:id" element={<ShowPage />} /> */}
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
