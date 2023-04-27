import React, { useState, useEffect } from 'react';
import './Database.scss';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Exercise from '../Exercise/Exercise.js';

function Database() {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/exercises/").then(
            res => {
                setExercises(res.data);
            }
        ).catch(error => {
            console.error(error);
        });

    }, []);

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
