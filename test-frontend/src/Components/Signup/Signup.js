import React, { useState }from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import commercialGym from '../../images/commercial-gym.jpg';
import noEquipment from '../../images/no-equipment.jpg';

// Icons

function Signup() {
    let navigate = useNavigate();
    const [basicInfoSubmitted, setbasicInfoSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [age, setAge] = useState(0);
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);



    function completePage() {
        setEmail(document.getElementById("email").value);
        setPassword(document.getElementById("password").value);
        setName(document.getElementById("firstName").value + ' ' + document.getElementById("lastName").value);
        setGoal(document.querySelector('input[name="goalRadio"]:checked').value);
        let fitGoal = document.querySelector('input[name="goalRadio"]:checked').value;
        if (!fitGoal || !fitGoal.length) fitGoal = document.getElementById('customGoal').value;
        setGoal(fitGoal);
        setAge(Number(document.getElementById('inputAge').value));
        setHeight(Number(document.getElementById('heightFeet').value) * 12 + Number(document.getElementById('heightInches').value));
        setWeight(Number(document.getElementById('weight').value));
        
        setbasicInfoSubmitted(true);
        
        console.log('done');
    }

    async function submitSignup() {
        let equipment = (document.querySelector('input[name="equipmentRadio"]:checked').value);
        if (!equipment || !equipment.length) equipment = document.getElementById('customEquipment').value;
        console.log(age);

        try {
            const res = await axios.post(`http://localhost:5000/users/add_user`, {
                name: name,
                email: email,
                password: password,
                goal: goal,
                age: age,
                height: height,
                weight: weight,
                equipment: equipment
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.id);
            console.log('signedup');
            navigate('/');
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    

    return (
        <div className='signup'>

            <div className='container-fluid'>
                <h1 className='header'>{!basicInfoSubmitted ? "Hello!" : "Thanks for the info! Now,"}</h1>

                {!basicInfoSubmitted ? 
                <form className='signup-form'>
                    <div className="form-group">
                        <label for="email">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label for="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password"/>
                    </div>
                    <div className="row">
                        <p>Name</p>
                        <div className="col">
                            <input type="text" className="form-control" id="firstName" placeholder="First name"/>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" id="lastName" placeholder="Last name"/>
                        </div>
                    </div>
                    <div className='radio'>
                        <label for="radio">What is your goal?</label>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="gainMuscle" value="Gain Muscle" defaultChecked/>
                            <label className="form-check-label" for="gainMuscle">
                                Gain Muscle
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="loseFat" value="Lose Fat"/>
                            <label className="form-check-label" for="loseFat">
                                Lose Fat
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="toneBody" value="Tone Body"/>
                            <label className="form-check-label" for="toneBody">
                                Tone Body
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="improveEndurance" value="Improve Endurance"/>
                            <label className="form-check-label" for="improveEndurance">
                                Improve Endurance
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" value=""/>
                            <input type="text" className="form-control" id="customGoal" placeholder="Custom Goal" />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group col-md-3">
                            <label for="inputAge">Age</label>
                            <select id="inputAge" className="form-control">
                                <option defaultValue>Choose...</option>
                                {[...Array(87)].map((x, i) =>
                                    <option key={i}>{i+13}</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group col-md-5">
                            <label for="inputHeight">Height</label>
                            <div className="row">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Feet" id="heightFeet"/>
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Inches" id="heightInches"/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label for="inputWeight">Weight</label>
                            <input type="text" className="form-control" placeholder="Lbs" id="weight"/>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={()=>completePage()}>Next</button>
                </form>
             : <form className='signup-form'>
                <div className='radio two'>
                        <label for="radio">What equipment is available to you?</label>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="equipmentRadio" id="commercialGym" value="Commercial Gym" defaultChecked/>
                            <label className="form-check-label" for="commercialGym">
                                Commercial Gym
                            </label>
                            <img src={commercialGym} className="ms-auto"/>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="equipmentRadio" id="noEquipment" value="No equipment"/>
                            <label className="form-check-label" for="noEquipment">
                                Nothing
                            </label>
                            <img src={noEquipment} className="ms-auto"/>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="equipmentRadio" value=""/>
                            <input type="text" className="form-control" id="customEquipment" placeholder="Custom Equipment"/>
                        </div>
                    </div>
                    <button type='button' className="btn btn-primary" onClick={()=>submitSignup()}>Submit</button>
                </form> }
            </div>
        </div>
    );
}

export default Signup;

