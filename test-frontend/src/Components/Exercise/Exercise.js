import React, { useEffect, useState }from 'react';
// import Logo from "../../icons/LandingLogo.svg"
// // import './SearchBar.css';
import './Exercise.scss';
import { useNavigate } from 'react-router-dom';
const fetch = require('node-fetch');

const Exercise = ({exercise, rowOfThree}) => {
    const [expanded, setExpanded] = useState(false);
    const [img, setImg] = useState();

    const cardClass = rowOfThree ? 'exercise col-lg-3 col-md-3 col-sm-12' : 'exercise col-lg-5 col-md-5 col-sm-12';

    function youtubeLink() {
        window.open(`https://www.youtube.com/results?search_query=How+to+do+${exercise.name}`);
    }
    
    
    useEffect(() => {
        setImg(localStorage.getItem(exercise.name));
        if(!localStorage.getItem(exercise.name)) {
            console.log('new one');
            fetch(
                'https://customsearch.googleapis.com/customsearch/v1?' +
                new URLSearchParams({
                    cx: 'f344ebd878af348de',
                    imgType: 'animated',
                    q: exercise.name + ' exercise',
                    safe: 'high',
                    searchType: 'image',
                    key: 'AIzaSyBwqcEz79ujjE_9btqaOA2chpFnKqBhKJE',
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
    },[])


    
     return(  
     <div key ={exercise.name} className={cardClass + (expanded ? ' expanded' : '')}>
        <h3 className="feature-title" onClick={()=> youtubeLink()}>{exercise.name}</h3>
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
