import React, { useState, useEffect } from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Stats.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Exercise from '../Exercise/Exercise.js';

// Icons

function Stats() {
    let navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [goal, setGoal] = useState('');

    
    // async function getExercises() {
    useEffect(() => {
        axios.get("http://localhost:5000/exercises/").then(
            res => {
                setExercises(res.data);
            }
        ).catch(error => {
            console.log(error);
        });

            const id = window.localStorage.id;
            axios.get(`http://localhost:5000/users/${id}`).then(
                res => {
                    setGoal(res.data.goal);
                }
            ).catch(error => {
                console.log(error);
            });

    }, []);
    // }
        // getExercises();
        const exerciseRows = [];

        function handlePrChange(exercise, e) {
            try {
                const res = axios.post(`http://localhost:5000/exercises/${exercise.name}`, {pr: e?.target.value});
                console.log(res);
            } catch (err) {
                console.error(err);
            }

        }

        exercises.sort((a, b) => (a.name).localeCompare(b.name));


        console.log(exercises[0])

        for (let i = 0; i < exercises?.length; i += 2) {
            const row = exercises.slice(i, i+2);
            
            exerciseRows.push(
                <div className='row exercise-row'>
                    {row.map((exercise) => 
                    <div key ={exercise.name} className='exercise col-md-5'>
                        <h3 className="feature-title">{exercise.name}</h3>
                        <div className='pr-details'>
                            <span className='pr'>{'Your current weight for this exercise is '}</span>
                            <div className="form-group col-md-3">
                                    <input type="text" className="form-control" placeholder="Weight Used" id="pr" defaultValue={exercise.pr} onChange={(e) => handlePrChange(exercise, e)}/>
                        </div>
                        <span className='pr'>{'lbs '}</span>
                        </div>
                            <span className='pr'>{'for ' + exercise.sets + ' sets, each with ' + exercise.reps + ' reps.'}</span>
                    </div>)}
                </div>
            );
        }


    return (
        <div className='stats'>

            <div className='container-fluid'>
            <h1 className='header'>Current Goal</h1>
            <p>Your current workout goal is to {goal}. Good luck, you got this!</p>

                <h1 className='header'>Stat List</h1>
                        <div className='workout-box'>
                            <div className='exercises'>
                                {exerciseRows}
                            </div>
                        </div>
            </div>
        </div>
    );
}

export default Stats;
