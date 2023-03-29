import React from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.scss'

const Navbar = (props) => {
  const navigate = useNavigate();

  function logOut() {
    window.localStorage.clear();
    navigate('/login');
    window.location.reload();
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="../">
        FitFlow
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="../">
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="../stats">
              Goals + Stats
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              FitFlow Bot
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="../exercises">
              Exercise Database
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto right">
                <li className="nav-item">
                  {props.loggedIn ? <div className="right-align">
                                      <a className="nav-link" href="../profile">My Account</a>
                                      <div className="nav-link click" onClick={() => {logOut()}}>Log Out</div>
                                    </div> :
                                    <a className="nav-link" href="../profile">Log In</a>
                  }
                </li>
            </ul>
      </div>
    </nav>
  );
};

export default Navbar;