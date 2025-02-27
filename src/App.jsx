import './App.css';
import Page1 from './frontpage/Page1';
import Page2 from './frontpage/Page2';
import { Routes, Route } from "react-router-dom";
import Login from './frontpage/login';
function App() {
  return (
    <Routes>
     <Route path="/" element={<><Page1/><Page2/></>} />
     <Route path="/login" element={<Login/>} />
   </Routes>
  )
}

export default App
