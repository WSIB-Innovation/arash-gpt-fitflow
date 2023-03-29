import React, { useState, useEffect }from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Dashboard.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Exercise from '../Exercise/Exercise.js';
import CreatableSelect from 'react-select/creatable';
import Creatable, { useCreatable } from 'react-select/creatable';


// Icons

function Dashboard() {
    let navigate = useNavigate();
    const [workout, setWorkout] = useState();
    const [name, setName] = useState();
    const [exerciseRows, setExerciseRows] = useState([]);

    //Dummy Variables for now
    const id = 0;

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const rows = [];
        for (let i = 0; i < workout?.exercises?.length; i += 2) {
            const row = workout.exercises.slice(i, i+2);
            
            rows.push(
                <div className='row exercise-row'>
                    {row.map((exercise) => 
                    <Exercise exercise={exercise}/>)}
                </div>
            );
            setExerciseRows(rows);
        }
    },[workout]);

    async function getData() {
        try {
            const id = localStorage.getItem('id');
            const res = await axios.get(`http://localhost:5000/users/${id}`);
            setName(res.data.name.split(' ')[0]);
            setWorkout(JSON.parse(res.data.workout));
    
            // console.log(exerciseRows);
            // console.log(res.data.workout);
        } catch (err) {
            console.error(err);
        }
    }

    async function genWorkout() {
        const id = localStorage.id;
        let query = multiValueWO.length? multiValueWO : multiValueM.length ? multiValueM : multiValueC.length ? multiValueC : multiValueI;
        const injury = query == multiValueI;
        let queryArr = [];
        for (const item of Object.values(query)) {
            queryArr.push(item.value);
          }
        query = queryArr.join();

        try {
            const res = await axios.post(`http://localhost:5000/exercises/generate_workout`, {
                injury: injury,
                query: query,
                id: id
            });
            getData();
        } catch (err) {
            console.error(err);
        }
    }

    const [multiValueWO, setMultiValueWO] = useState([]);
    const [multiValueM, setMultiValueM] = useState([]);
    const [multiValueC, setMultiValueC] = useState([]);
    const [multiValueI, setMultiValueI] = useState([]);
    const workoutOptions = [
        { value: 'push day', label: 'Push Day' },
        { value: 'pull day', label: 'Pull Day' },
        { value: 'legs day', label: 'Legs Day' },
        { value: 'cardo', label: 'Cardio' },
        { value: 'HIIT', label: 'HIIT' },
        { value: 'flexibility', label: 'Flexibility' },
    ]

    const musclesToFocus = [
        { value: 'biceps', label: 'Biceps' },
        { value: 'triceps', label: 'Triceps' },
        { value: 'chest', label: 'Chest' },
        { value: 'shoulders', label: 'Shoulders' },
        { value: 'back', label: 'Back' },
        { value: 'legs', label: 'Legs' },
        { value: 'glutes', label: 'Glutes' },
    ]

    function handleMultiChangeWO(option) {
        setMultiValueWO(option);
        setMultiValueC([]);
        setMultiValueM([]);
        setMultiValueI([]);
      }

    function handleMultiChangeM(option) {
        setMultiValueM(option);
        setMultiValueWO([]);
        setMultiValueC([]);
        setMultiValueI([]);
    }

    function handleMultiChangeC(option) {
        setMultiValueC(option);
        setMultiValueM([]);
        setMultiValueWO([]);
        setMultiValueI([]);
    }

    function handleMultiChangeI(option) {
        setMultiValueI(option);
        setMultiValueC([]);
        setMultiValueM([]);
        setMultiValueWO([]);
      }
    
    let message = "Hope you're having a ";
    switch (new Date().getDay()) {
        case 0:
            message += "Super Sunday";
            break;
        case 1:
            message += "Marvelous Monday";
            break;
        case 2:
           message += "Terrific Tuesday";
          break;
        case 3:
          message += "Wonderful Wednesday";
          break;
        case 4:
          message += "Thankful Thursday";
          break;
        case 5:
          message += "Faboulous Friday";
          break;
        case 6:
          message += "Special Saturday";
      }
      message += "!";
    

    return (
        <div className='dashboard'>

        {name ? 
            <div className='container-fluid'>
                <h1 className='header'>{"Hello " + (name ?? '')}</h1>
                <h5 className='subheader main'>{message}</h5>
                {workout &&
                    <div className='workout-box'>
                        <h2 className='workout-header'>Today's Workout</h2>
                        <h5 className='subheader above-workout'>{'Remember! ' + workout?.message}</h5>
                        <div className='exercises'>
                            {exerciseRows}
                        </div>
                    </div>
                }
                    <div className='create-workout'>
                        {   workout ? <h5 className='subheader'> Don't like what you see? Let's generate another workout!</h5>
                                    : <h5 className='subheader'> I see you don't have a workout planned for today yet. Let's get on that.</h5>
                        }
                        <div className='workout-creator'>
                            <h3 className='subheader'>Please select an option from a dropdown below</h3>
                            <div className='row dropdowns'>
                                <div className='col'>
                                    <CreatableSelect
                                    name="commonWorkouts"
                                    placeholder="Common Workouts"
                                    value={multiValueWO}
                                    options={workoutOptions}
                                    onChange={handleMultiChangeWO}
                                    isMulti
                                    />
                                </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="muscles"
                                    placeholder="Muscles to Focus"
                                    value={multiValueM}
                                    options={musclesToFocus}
                                    onChange={handleMultiChangeM}
                                    isMulti
                                    />
                                </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="injury"
                                    placeholder="Injury Rehabilitation"
                                    value={multiValueI}
                                    onChange={handleMultiChangeI}
                                    isMulti
                                    />
                                </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="custom"
                                    placeholder="Custom Query"
                                    value={multiValueC}
                                    onChange={handleMultiChangeC}
                                    isMulti
                                    />
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={() => genWorkout()}>
                                Generate Workout
                            </button>
                        </div>
                    </div>
            </div>
        :
        <div/>
        }
        </div>
    );
}

export default Dashboard;
