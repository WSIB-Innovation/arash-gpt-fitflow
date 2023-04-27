import React, { useEffect, useState }from 'react';
import './Exercise.scss';
const fetch = require('node-fetch');

const Exercise = ({exercise, rowOfThree, remove, updateState}) => {
    const [expanded, setExpanded] = useState(false);
    const [img, setImg] = useState();

    const cardClass = rowOfThree ? 'exercise col-lg-3 col-md-3 col-sm-12' : 'exercise col-lg-5 col-md-5 col-sm-12';
    let completed = exercise.completed;

    function youtubeLink() {
        window.open(`https://www.youtube.com/results?search_query=How+to+do+${exercise.name}`);
    }


    
    
    useEffect(() => {
        setImg(localStorage.getItem(exercise.name));
        if(!localStorage.getItem(exercise.name)) {
            fetch(
                'https://customsearch.googleapis.com/customsearch/v1?' +
                new URLSearchParams({
                    cx: 'f344ebd878af348de',
                    imgType: 'animated',
                    q: exercise.name + ' exercise',
                    safe: 'high',
                    searchType: 'image',
                    key: 'AIzaSyCqcb4YW1POoczXHzs0de1q909u2FyQmYk',
                }),
                {
                    method: 'GET',
                    compress: true,
                    headers: new fetch.Headers({ Accept: 'application/json' }),
                }
                ).then(function(res) {
                    return res.json();
                }).then(function(data) {
                    setImg(data.items[0].link);
                    localStorage.setItem(exercise.name, data.items[0].link);
                })
        }
    },[exercise])


    
     return(  
     <div key ={exercise.name} className={cardClass + (expanded ? ' expanded' : '')}>
        <h3 className={"feature-title" + (completed ? ' completed' : '')} onClick={()=> youtubeLink()}>{exercise.name}</h3>
        {remove && 
        <div className='icons'>
            <div className='completion' onClick={() => {updateState(exercise); completed = true;}}>
                <img src={completed ? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/1200px-Red_X.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Icons8_flat_checkmark.svg/768px-Icons8_flat_checkmark.svg.png"}/>
            </div>
            <div className='delete' onClick={() => remove(exercise)}>
                <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"/>
            </div> 
        </div>}
        <div className='details'>
            <span className="sets">{exercise.sets} Sets</span>
            <span className="reps">{exercise.reps} Reps</span>
        </div>
        <img src={img} className={expanded ? ' active' : ''}/>
        <p>{exercise.desc}</p>
        <div className='expand-container'>
            <i className={`las la-caret-down` + (expanded ? '' : ' active')} onClick={() => {setExpanded(!expanded)}}/>
            <i className={`las la-caret-up` + (expanded ? ' active' : '')} onClick={() => {setExpanded(!expanded)}}/>
        </div>
    </div>
    )
}

export default Exercise;
