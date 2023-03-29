import React, { useState, useEffect } from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Database.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Exercise from '../Exercise/Exercise.js';

// Icons

function Database() {
    let navigate = useNavigate();
    const [exercises, setExercises] = useState([]);

    
    // async function getExercises() {
    useEffect(() => {
        axios.get("http://localhost:5000/exercises/").then(
            res => {
                setExercises(res.data);
            }
        ).catch(error => {
            console.log(error);
        });

    }, []);
    // }
        // getExercises();
        const exerciseRows = [];


        for (let i = 0; i < exercises?.length; i += 3) {
            const row = exercises.slice(i, i+3);
            
            exerciseRows.push(
                <div className='row exercise-row'>
                    {row.map((exercise) => 
                    <Exercise exercise={exercise} rowOfThree={true} />)}
                </div>
            );
        }

        console.log(exerciseRows);

    return (
        <div className='database'>

            <div className='container-fluid'>
                <h1 className='header'>Exercise List</h1>
                        <div className='workout-box'>
                            <div className='exercises'>
                                {exerciseRows}
                            </div>
                        </div>
            </div>
        </div>
    );
}

export default Database;
