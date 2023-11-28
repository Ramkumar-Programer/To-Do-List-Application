
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Reg from "./Compoments/Athu/Reg"
import Login from './Compoments/Athu/Login';
import ForgotPassword from './Compoments/Athu/ForgotPassword';
import Board from './Compoments/Board/Board';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/Login" Component={Login} />
          <Route path='/Register' Component={Reg} />
          <Route path= '/Board' Component={Board} />
          <Route path= '/ForgotPassword' Component={ForgotPassword} />
          <Route path="/" element={<Navigate to="/Login" />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
