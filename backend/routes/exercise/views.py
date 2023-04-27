from flask import Blueprint, request, jsonify, make_response, url_for, redirect
from extensions import db
from .models import Exercise
from .inital import initExercises
from ..user.models import User
import openai
import json
from datetime import datetime
from environs import Env

env = Env()
env.read_env()


blueprint = Blueprint("exercise", __name__, url_prefix='/exercises')

openai.api_key = env.str("OPENAI_API_KEY")
openai.api_type = "azure"
openai.api_base = "https://fitflow.openai.azure.com/"
openai.api_version = "2023-03-15-preview"

@blueprint.route("/", methods=['GET'])
def get_exercises():
    exercises = Exercise.query.all()
    return jsonify(exercises)

@blueprint.route('/<name>', methods=['GET', 'POST'])
def update_exercise(name):
    exercise_data = request.get_json()
    
    exercise = Exercise.query.get(name)
    if exercise:
        if len(exercise.prs) > 0:
            exercise.prs = exercise.prs + ',' + exercise_data['pr']
        else:
            exercise.prs = exercise.prs + exercise_data['pr']

        db.session.commit()
    
    return 'Done', 201

@blueprint.route('/add_exercise', methods=['GET', 'POST'])
def post_exercise():
    exercise_data = request.get_json()

    new_exercise = Exercise(name=exercise_data['name'], reps=exercise_data['reps'], sets=exercise_data['sets'], desc=exercise_data['desc'])

    db.session.add(new_exercise)
    db.session.commit()

    return 'Done', 201

@blueprint.route('/init_exercises', methods=['GET', 'POST'])
def post_exercises():
    

    for exercise_data in initExercises:
        new_exercise = Exercise(name=exercise_data['name'], reps=exercise_data['reps'], sets=exercise_data['sets'], desc=exercise_data['desc'])

        db.session.add(new_exercise)
        db.session.commit()

    return 'Done', 201


@blueprint.route('/generate_workout', methods=['GET', 'POST'])
def generate_workout():
    exercises = Exercise.query.all()
    exercise_list = ''
    for exercise in exercises:
      exercise_list += exercise.name + ', '
    jsonExercises = jsonify(exercises)

    data = request.get_json()

    message = "Create me a workout "
    if (data['num']):
        message += 'with ' + data['num'] + ' exercises, '
    if (data['set']):
        message += 'where every exercise has ' + data['set'] + ' sets, '
    if (data['rep']):
        message += 'where every set has ' + data['rep'] + ' reps, '
    message = message + "focussing on "
    if (data['injury']):
        message += "injury rehabilitation of a(n) "
    message = message + data['query'] + '.'
    if (data['time']):
        message = message + ' Please note that I have a ' + data['time'] + ' time restriction.'
    if (data['activities']):
        message = message + ' If possible, cater the workout to aid with the following activities, if applicable: ' + data['activities'] + '.'
    if (data['injuries']):
        message = message + ' Please note that I have the following injuries, so I would not want to strain them very much: ' + data['injuries'] + '.'
    message = message + ' Return a JSON object where each entry outlines the name, sets and reps (Number, not to failure) of each exercise. Finally, have the last object be a message with any additional comments if any. The format should look like this: {"exercises": [{"name": "Dips", "sets": 3, "reps": 3}], "message": "x"}'


    response = openai.ChatCompletion.create(
        engine="gpt-35-turbo",
        messages=[{"role": "user", "content": message}],
    )


    responseJSON = json.loads(response.choices[0].message.content)

    for exercise in responseJSON['exercises']:
        name = exercise['name']
        exercise['completed'] = False
        dbObj = Exercise.query.get(name)
        if not dbObj:
            exerciseMsg = "Give me a short description on the exercise " + name
            if data['activities']:
                exerciseMsg = exerciseMsg + ". Explain how this exercise aids with the following activities in the description, if applicable: " + data['activities']
            exerciseDesc = openai.ChatCompletion.create(
                engine="gpt-35-turbo",
                messages=[{"role": "user", "content": exerciseMsg}],
            )
            
            new_exercise = Exercise(name=exercise['name'], reps=exercise['reps'], sets=exercise['sets'], desc=exerciseDesc.choices[0].message.content)
            db.session.add(new_exercise)
            db.session.commit()
            exercise['desc'] = new_exercise.desc  
        else:
            exercise['desc'] = dbObj.desc

    user = User.query.get(data['id'])
    jsonVers = json.dumps(responseJSON)
    user.workout = jsonVers

    db.session.commit()

    return 'Done', 201
