import React, { useState, useEffect } from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Stats.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Exercise from '../Exercise/Exercise.js';
import Chart from 'chart.js/auto'

// Icons

function Stats() {
    let navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [goal, setGoal] = useState('');
    const [ready, setReady] = useState(false);

    
    // async function getExercises() {
    useEffect(() => {
        axios.get("http://localhost:5000/exercises/").then(
            res => {
                setExercises(res.data);
                // console.log(res.data);
        setReady(true);

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
                const res = axios.post(`http://localhost:5000/exercises/${exercise.name}`, {pr: e?.value});
                console.log(res);
            } catch (err) {
                console.error(err);
            }

        }

        function submitAll() {
            const newPRs = document.getElementsByClassName('form-control');

            for (let i = 0; i < exercises.length; ++i) {
                // if ( i ==0 ) console.log((newPRs[i].value && (!exercises[i].prArray || newPRs[i].value != exercises[i].prArray.at(-1))));
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


        // (async function() {
        //     const data = [
        //       { year: 1, count: 25 },
        //       { year: 2, count: 22 },
        //       { year: 3, count: 30 },
        //       { year: 4, count: 28 },
        //     ];
          
        //     new Chart(
        //       document.getElementById('acquisitions'),
        //       {
        //         type: 'line',
        //         data: {
        //           labels: [1,2,3],
        //           datasets: [{
        //             label: 'My First Dataset',
        //             data: [65, 59, 80],
        //             fill: false,
        //             borderColor: 'rgb(75, 192, 192)',
        //             tension: 0.1
        //           }]
        //         }
        //       }
        //     );
        //   })();

        useEffect(() => {
        for (let i = 0; i < exercises.length; ++i) {
            (async function() {
                const data = [
                  { year: 1, count: 25 },
                  { year: 2, count: 22 },
                  { year: 3, count: 30 },
                  { year: 4, count: 28 },
                ];

                // console.log( exercises[i].prArray.map((pr, idx) => ({year: idx, count: pr})));
                // console.log([...Array(exercises[i].prArray.length).keys()]);

                // if(i == 0) {
              

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
                    }
                    );
                // }
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
