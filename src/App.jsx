import './App.css';
import Page1 from './frontpage/Page1';
import Page2 from './frontpage/Page2';
import { Routes, Route } from "react-router-dom";
import Login from './frontpage/login';
import Signup from './frontpage/Signup';
import Search from './frontpage/search';
import Result from './frontpage/Result';
import { StrictMode } from 'react';
function App() {
  return (
    <Routes>
     <Route path="/" element={<><Page1/><Page2/></>} />
     <Route path="/login" element={<Login/>} />
     <Route path="/signup" element={<Signup/>} />
     <Route path="/search" element={<Search/>} />
     <Route path="/result" element={<Result/>} />
   </Routes>
  )
}

export default App
