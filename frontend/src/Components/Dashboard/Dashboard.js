import React, { useState, useEffect }from 'react';
import './Dashboard.scss';
import axios from 'axios';
import "../Exercise/Exercise.js"
import Exercise from '../Exercise/Exercise.js';
import CreatableSelect from 'react-select/creatable';


function Dashboard() {
    const [workout, setWorkout] = useState();
    const [name, setName] = useState();
    const [exerciseRows, setExerciseRows] = useState([]);
    const [activities, setActivities] = useState('');
    const [injuries, setInjuries] = useState('');
    const [time, setTime] = useState(0);
    const [timerActive, setTimerActive] = useState(0);

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);


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
                    <Exercise exercise={exercise} remove={deleteExercise} updateState={updateState}/>)}
                    {row.length == 1 && 
                    <div className='addExercise exercise col-lg-5 col-md-5 col-sm-12'>
                        <h1 onClick={addExercise}>+</h1>
                        <CreatableSelect
                        name="addExercises"
                        placeholder="Add Exercise"
                        value={multiValueE}
                        onChange={()=> handleMultiChangeE}
                        isMulti
                        />
                    </div>
                    }
                </div>
            );
            setExerciseRows(rows);
        }
        if (workout?.exercises?.length % 2 == 0) {
            rows.push(
                <div className='row exercise-row'>
                    <div className='addExercise exercise col-lg-5 col-md-5 col-sm-12'>
                        <h1 onClick={addExercise}>+</h1>
                        <CreatableSelect
                        name="addExercises"
                        placeholder="Add Exercise"
                        value={multiValueE}
                        onChange={()=> handleMultiChangeE}
                        isMulti
                        />
                    </div>
                </div>
            )
        }
    },[workout]);

    useEffect(() => {
        let interval;
        if (timerActive) {
            interval = setInterval(() => setTime(time + 1), 1000);
        }
        return () => clearInterval(interval);
    },[timerActive, time]);
    
    function flipTimer() {
        setTimerActive(!timerActive);
    }

    async function deleteExercise(exercise) {
        const idx = workout.exercises.indexOf(exercise);
        let newWorkout = [];
        if (idx > -1) {
            workout.exercises.splice(idx, 1);
            newWorkout = workout.exercises;
        }
        setWorkout({exercises: newWorkout, message: workout.message});
        const id = localStorage.getItem('id');
        await axios.post(`http://localhost:5000/users/update_user/${id}`, {
            workout: {exercises: newWorkout, message: workout.message}
        });
    }

    async function updateState(exercise) {
        const idx = workout.exercises.indexOf(exercise);
        let newWorkout = workout.exercises;
        if (idx > -1) {
            newWorkout[idx].completed = !newWorkout[idx].completed;
        }
        setWorkout({exercises: newWorkout, message: workout.message});
        const id = localStorage.getItem('id');
        await axios.post(`http://localhost:5000/users/update_user/${id}`, {
            workout: workout
        });
    }

    async function getData() {
        try {
            const id = localStorage.getItem('id');
            const res = await axios.get(`http://localhost:5000/users/${id}`);
            setName(res.data.name.split(' ')[0]);
            setWorkout(JSON.parse(res.data.workout));
            setActivities(res.data.activities);
            setInjuries(res.data.injuries)

            const resEx = await axios.get("http://localhost:5000/exercises/");

            for (let i = 0; i < resEx.data.length, allExercises.length < resEx.data.length; ++i) {
                allExercises.push({value: 'resEx.data[i]', label: resEx.data[i].name});
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function genWorkout() {
        const id = localStorage.id;
        let query = multiValueWO.length ? multiValueWO : multiValueM.length ? multiValueM : multiValueC.length ? multiValueC : multiValueI;
        const injury = query == multiValueI;
        let queryArr = [];
        for (const item of Object.values(query)) {
            queryArr.push(item.value);
          }
        query = queryArr.join();
        const cater = document.getElementById("sports").checked;

        try {
            await axios.post(`http://localhost:5000/exercises/generate_workout`, {
                injury: injury,
                query: query,
                num: multiValueNum?.value ?? false,
                set: multiValueSet?.value ?? false,
                rep: multiValueRep?.value ?? false,
                time: multiValueTime?.value ?? false,
                id: id,
                activities: cater ? activities : false,
                injuries: injuries
            });
            getData();
        } catch (err) {
            console.error(err);
        }
    }

    function addExercise() {

    }

    const [multiValueWO, setMultiValueWO] = useState([]);
    const [multiValueM, setMultiValueM] = useState([]);
    const [multiValueC, setMultiValueC] = useState([]);
    const [multiValueI, setMultiValueI] = useState([]);
    const [multiValueE, setMultiValueE] = useState([]);
    const [multiValueNum, setMultiValueNum] = useState([]);
    const [multiValueSet, setMultiValueSet] = useState([]);
    const [multiValueRep, setMultiValueRep] = useState([]);
    const [multiValueTime, setMultiValueTime] = useState([]);
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

    const numSet = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
    ]

    const numExercise = numSet.concat([
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
    ]);

    const numReps = numExercise.concat([
        { value: '13', label: '13' },
        { value: '14', label: '14' },
        { value: '15', label: '15' },
        { value: '16', label: '16' },
        { value: '17', label: '17' },
        { value: '18', label: '18' },
        { value: '19', label: '19' },
        { value: '20', label: '20' },
    ]);

    const timeOptions = [
        { value: '10 minutes', label: '10 Minutes' },
        { value: '15 minutes', label: '15 Minutes' },
        { value: '20 minutes', label: '20 Minutes' },
        { value: '30 minutes', label: '30 Minutes' },
        { value: '45 minutes', label: '45 Minutes' },
        { value: '60 minutes', label: '60 Minutes' },
        { value: '75 minutes', label: '75 Minutes' },
        { value: '90 minutes', label: '90 Minutes' },
        { value: '120 minutes', label: '120 Minutes' },
    ]

    const allExercises = [];

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

    function handleMultiChangeE(option) {
        setMultiValueE(option);
        setExerciseRows(exerciseRows);
    }

    function handleMultiChangeNum(option) {
        setMultiValueNum(option);
    }
    
    function handleMultiChangeSet(option) {
        setMultiValueSet(option);
    }

    function handleMultiChangeRep(option) {
        setMultiValueRep(option);
    }

    function handleMultiChangeTime(option) {
        setMultiValueTime(option);
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
                        <div className='timer'>
                            <p className="time">
                                {hours}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                            </p>
                            <div className="buttons">
                                <button className="start" onClick={flipTimer}>
                                {timerActive ? "Stop" : "Start"}
                                </button>
                                <button className="reset" onClick={()=>{setTime(0); setTimerActive(false)}}>
                                Reset
                                </button>
                            </div>
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
                            <div className='row dropdowns'>
                                <div className='col-md-2 centerAlign'>Options (Optional): </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="exercises"
                                    placeholder="# of exercises"
                                    options={numExercise}
                                    value={multiValueNum}
                                    onChange={handleMultiChangeNum}
                                    />
                                </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="sets"
                                    placeholder="Fixed sets"
                                    options={numSet}
                                    value={multiValueSet}
                                    onChange={handleMultiChangeSet}
                                    />
                                </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="reps"
                                    placeholder="Fixed reps"
                                    options={numReps}
                                    value={multiValueRep}
                                    onChange={handleMultiChangeRep}
                                    />
                                </div>
                                <div className='col'>
                                    <CreatableSelect
                                    name="time"
                                    placeholder="Time Restriction"
                                    options={timeOptions}
                                    value={multiValueTime}
                                    onChange={handleMultiChangeTime}
                                    />
                                </div>
                                <div className='col activities'>
                                    <input type="checkbox" id="sports" name="sports"/>
                                    <label for="sports">Cater to activities?</label>
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
