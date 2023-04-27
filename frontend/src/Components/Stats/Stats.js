import React, { useState, useEffect } from 'react';
import './Stats.scss';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Chart from 'chart.js/auto'

function Stats() {
    const [exercises, setExercises] = useState([]);
    const [goal, setGoal] = useState('');
    const [ready, setReady] = useState(false);

    
    useEffect(() => {
        axios.get("http://localhost:5000/exercises/").then(
            res => {
                setExercises(res.data);
                setReady(true);
            }
        ).catch(error => {
            console.error(error);
        });

            const id = window.localStorage.id;
            axios.get(`http://localhost:5000/users/${id}`).then(
                res => {
                    setGoal(res.data.goal);
                }
            ).catch(error => {
                console.error(error);
            });

    }, []);

        const exerciseRows = [];

        function handlePrChange(exercise, e) {
            try {
                axios.post(`http://localhost:5000/exercises/${exercise.name}`, {pr: e?.value});
            } catch (err) {
                console.error(err);
            }

        }

        function submitAll() {
            const newPRs = document.getElementsByClassName('form-control');

            for (let i = 0; i < exercises.length; ++i) {
                if (newPRs[i].value && (!exercises[i].prArray || newPRs[i].value != exercises[i].prArray.at(-1))) {
                    handlePrChange(exercises[i], newPRs[i]);
                }
            }
            window.location.reload()
        }

        exercises.sort((a, b) => (a.name).localeCompare(b.name));

        for (let i = 0; i < exercises.length; ++i) {
            exercises[i].prArray = exercises[i].prs?.split(',');
        }

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
                                    <input type="text" className="form-control" placeholder="Weight Used" id="pr" defaultValue={exercise.prArray?.at(-1)} />
                            </div>
                            <span className='pr'>{'lbs '}</span>
                        </div>
                        <div style={{width: '300px', alignSelf: 'center'}}><canvas id={"acquisitions" + exercise.name}></canvas></div>
                        <span className='pr'>{'for ' + exercise.sets + ' sets, each with ' + exercise.reps + ' reps.'}</span>
                    </div>)}
                </div>
            );
        }

        useEffect(() => {
            for (let i = 0; i < exercises.length; ++i) {
                (async function() {
                    new Chart(
                    document.getElementById('acquisitions' + exercises[i].name),
                    {
                        type: 'line',
                        data: {
                            labels: Array.from({length: exercises[i].prArray.length}, (_, i) => i + 1),
                            datasets: [{
                                label: 'PR Progression',
                                data: exercises[i].prArray,
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        }
                    });
                })();
            }
        },[ready]);
       

    return (
        <div className='stats'>

            <div className='container-fluid'>
                <h1 className='header'>Current Goal</h1>
                <p>Your current workout goal is to {goal}. Good luck, you got this!</p>
                <h1 className='header'>Stat List</h1>
                <button onClick={submitAll}>Submit</button>
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
