import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons

function Login() {
    let navigate = useNavigate();
    const [didFail, setDidFail] = useState(false);

    async function submitLogin() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const res = await axios.post(`http://localhost:5000/users/login`, {
                email: email,
                password: password,
            });

            if (res) {
                console.log(res);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("id", res.data.id);
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            setDidFail(true);
        }
    }


    return (
        <div className='login'>

            <div className='container-fluid'>
                <h1 className='header'>Hello!</h1>
                <form className='login-form'>
                    <div className="form-group">
                        <label for="email">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label for="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password"/>
                    </div>
                    <div className='spaced-row'>
                        <button type="button" className="btn btn-primary col-md-6" onClick={()=>submitLogin()}>Submit</button>
                        <button type="button" className="btn btn-secondary col-md-6" onClick={()=>navigate('/signup')}>Sign Up</button>
                    </div>
                    {didFail && <small id="loginFail" className="form-text text-danger">Invalid Email or Password. Please try again</small>}
                </form>
            </div>
        </div>
    );
}

export default Login;

