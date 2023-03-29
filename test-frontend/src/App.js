import './App.scss';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Dashboard from './Components/Dashboard/Dashboard';
import Database from './Components/Exercise/Database';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Components/Profile/Profile';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Stats from './Components/Stats/Stats';

function App() {
  const log = localStorage.getItem('token')?.length;
  

    async function getLoginStatus(loggedInToken, id) {
      try {
        // const res = await axios.get(`http://localhost:5000/users/login/${id}`, {
        //   params: {
        //     token: loggedInToken
        //   }
        // });
        const res = localStorage.getItem('token')?.length;
        console.log(res);
        return res;
      } catch (err) {
          localStorage.clear()
          return false;
      }
    }

    async function useLoginStatus() {
      console.log('hnnn');
      const loggedInToken = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      if (!loggedInToken || !id)  return (false);
      try {
        return (await getLoginStatus(loggedInToken, id));  
      } catch {
        return (false);
      }
    }

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar loggedIn={log}/>
      <div className='container'>
        <Routes>
          <Route path="/" element={log ? <Dashboard/> : <Login/>} />
          <Route path="/exercises" element={log ? <Database/> : <Login/>} />
          <Route path="/profile" element={log ? <Profile/> : <Login/>} />
          <Route path="/stats" element={log ? <Stats/> : <Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
