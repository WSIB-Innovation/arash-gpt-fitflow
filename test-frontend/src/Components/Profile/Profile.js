import React, { useEffect, useState }from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Profile.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import Creatable, { useCreatable } from 'react-select/creatable';

// Icons

function Profile() {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [customGoal, setCustomGoal] = useState(false);
    const [equipment, setEquipment] = useState({});
    const [age, setAge] = useState(0);
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);

    useEffect(() => {
        if (goal == 'Gain Muscle') document.getElementById("muscle").checked = true;
        else if (goal == 'Lose Fat') document.getElementById("fat").checked = true;
        else if (goal == 'Tone Body') document.getElementById("tone").checked = true;
        else if (goal == 'Improve Endurance') document.getElementById("endurance").checked = true;
        else if (goal) {
            document.getElementById("custom").checked = true;
            setCustomGoal(true);
        }
        console.log(equipment);
        if (document.getElementById("ageOption" + age)) document.getElementById("ageOption" + age).selected = "selected";
    },[goal,age,equipment]);

    useEffect(() => {
        getInfo();
    }, []);


    const gymOptions = [
        { value: 'Commercial Gym', label: 'Commercial Gym' },
        { value: 'No Equipment', label: 'No Equipment' },
    ];


    function handleEquipmentChange(option) {
        setEquipment(option);
    }

    async function submitProfile() {
        let fitGoal = (document.querySelector('input[name="goalRadio"]:checked').value);
        if (!fitGoal || !fitGoal.length) fitGoal = document.getElementById('customGoal').value;

        try {
            const id = localStorage.getItem('id');
            const res = await axios.post(`http://localhost:5000/users/update_user/${id}`, {
                name: document.getElementById("firstName").value + ' ' + document.getElementById("lastName").value,
                email: email,
                goal: fitGoal,
                age: age,
                height: Number(document.getElementById('heightFeet').value) * 12 + Number(document.getElementById('heightInches').value),
                weight: weight,
                equipment: equipment.value
            });
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }

    function capitalize(str) {
        if (!str) return;
        const words = str.split(" ");
        for (let i = 0; i < words.length; ++i) {
            if(!words[i]) continue;
            words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
        }
        return words.join(" ");;
    }


    async function getInfo() {
        try {
            const id = window.localStorage.id;
            const res = await axios.get(`http://localhost:5000/users/${id}`);
            if (res) {
                console.log(res);
                setEmail(res.data.email);
                setName(res.data.name);
                setGoal(res.data.goal);
                setAge(res.data.age);
                setHeight(res.data.height);
                setWeight(res.data.weight);
                setEquipment({value: res.data.equipment, label: res.data.equipment});
            }
          } catch (err) {
              console.error(err);
          }
    }


    return (
        <div className='profile'>

            <div className='container-fluid'>
                <h1 className='header'>Hello {capitalize(name)}!</h1>

                <form className='profile-form'>
                    <div className="form-group">
                        <label for="inputHeight">Name</label>
                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" id="firstName" placeholder="First Name" defaultValue={capitalize(name.split(' ')[0])}/>
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name" defaultValue={capitalize(name.split(' ')[1])}/>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="email">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" defaultValue={email} onChange={e => setEmail(e.target.value)}/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className='radio'>
                        <label for="radio">What is your goal?</label>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="muscle" value="Gain Muscle"/>
                            <label className="form-check-label" for="muscle">
                                Gain Muscle
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="fat" value="Lose Fat"/>
                            <label className="form-check-label" for="fat">
                                Lose Fat
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="tone" value="Tone Body"/>
                            <label className="form-check-label" for="tone">
                                Tone Body
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="endurance" value="Improve Endurance"/>
                            <label className="form-check-label" for="endurance">
                                Improve Endurance
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input radio" type="radio" name="goalRadio" id="custom" value=""/>
                            <input type="text" key={goal ? 'loaded' : 'notLoaded'} className="form-control" id="customGoal" placeholder="Custom Goal" defaultValue={customGoal ? goal : ''} onChange={() => {document.getElementById('custom').checked = true}} />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group col-md-3">
                            <label for="inputAge">Age</label>
                            <select id="inputAge" className="form-control" onChange={e => setAge(e.target.value)}>
                                {[...Array(87)].map((x, i) =>
                                    <option key={i} id={'ageOption' + (i+13)}>{i+13}</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group col-md-5">
                            <label for="inputHeight">Height</label>
                            <div className="row">
                                <div className="col">
                                    <input type="text" key={height ? 'loaded' : 'notLoaded'} className="form-control" id="heightFeet" placeholder="Feet" defaultValue={Math.floor(height / 12)}/>
                                </div>
                                <div className="col">
                                    <input type="text" key={height ? 'loaded' : 'notLoaded'} className="form-control" id="heightInches" placeholder="Inches" defaultValue={height % 12}/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label for="inputWeight">Weight</label>
                            <input type="text" key={weight ? 'loaded' : 'notLoaded'} className="form-control" placeholder="Lbs" defaultValue={weight} onChange={e => setWeight(e.target.value)}/>
                        </div>
                    </div>
                    <div className="form-group">
                            <label for="inputEquipment">Equipment</label>
                            <CreatableSelect
                                id="inputEquipment"
                                name="inputEquipment"
                                placeholder="Equipment Available"
                                value={equipment}
                                options={gymOptions}
                                onChange={handleEquipmentChange}
                            />
                        </div>
                    <button type="button" className="btn btn-primary" onClick={()=>submitProfile()}>Submit</button>
                </form>
            
            </div>
        </div>
    );
}

export default Profile;
