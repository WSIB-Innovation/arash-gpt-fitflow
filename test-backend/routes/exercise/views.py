from flask import Blueprint, request, jsonify, make_response, url_for, redirect
from extensions import db
from .models import Exercise
from .inital import initExercises
from ..user.models import User
import openai
import json
from datetime import datetime

blueprint = Blueprint("exercise", __name__, url_prefix='/exercises')

# openai.api_key = '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'
openai.api_key = '6f462a816c194b438986a3eeac099694'
openai.api_type = "azure"
openai.api_base = "https://fitflow.openai.azure.com/"
openai.api_version = "2023-03-15-preview"

@blueprint.route("/", methods=['GET'])
def get_exercises():
    exercises = Exercise.query.all()
    # # print(exercises[0].prs)
    # for exercise in exercises:
    #     # exercise.prs = jsonify(exercise.prs)
    #     prs=[]
    #     # print(1)
    #     for pastPr in exercise.prs:
    #         prs.append({'pr': pastPr.record, 'date': pastPr.date})
    #     exercise.pr = prs
    #     # print(exercise)
        
    #     # # print(exercise.pr)
    #     # # print(exercise.name)

    # exercises[0].name = 'apple'
    # # print(exercises[0].prs)
    # # print(exercises[0])
    return jsonify(exercises)

@blueprint.route('/<name>', methods=['GET', 'POST'])
def update_exercise(name):
    exercise_data = request.get_json()
    
    exercise = Exercise.query.get(name)
    if exercise:
        # now = datetime.now()
        # pr = Prtracker(record=exercise_data['pr'], exercise=exercise, date = now.strftime("%m/%d/%Y"))
        # db.session.add(pr)
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
        # print(exercise_data)
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
    print(data)
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

    print(message)

    response = openai.ChatCompletion.create(
        engine="gpt-35-turbo",
        messages=[{"role": "user", "content": message}],
    )

    # print(response.choices[0].message)

    responseJSON = json.loads(response.choices[0].message.content)

    # print(responseJSON['exercises'])
    # print(len(responseJSON['exercises']))

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
            # print(exerciseDesc)
            
            new_exercise = Exercise(name=exercise['name'], reps=exercise['reps'], sets=exercise['sets'], desc=exerciseDesc.choices[0].message.content)
            db.session.add(new_exercise)
            db.session.commit()
            exercise['desc'] = new_exercise.desc  
        else:
            exercise['desc'] = dbObj.desc

    user = User.query.get(data['id'])
    # print(type(responseJSON))
    # print(responseJSON)
    jsonVers = json.dumps(responseJSON)
    # print(jsonVers)
    # print(type(jsonVers))
    user.workout = jsonVers

    db.session.commit()

    return 'Done', 201




# @blueprint.route('/generate_workout', methods=['GET', 'POST'])
# def generate_workout():
#     exercises = Exercise.query.all()
#     exercise_list = ''
#     for exercise in exercises:
#       exercise_list + exercise.name + ', '
#     jsonExercises = jsonify(exercises)

#     # print(jsonExercises)

#     if request.method == "POST":
#       response = openai.ChatCompletion.create(
#           model="gpt-3.5-turbo",
#           messages=[{"role": "user", "content": "Using the following exercises, create me a workout focussing on Push day: " + exercise_list}],
#       )
#       # # print(response)
#       # print(response)
#       # print(jsonify(response))
#       # print(response['choices'][0]['message']['content'])
#       return redirect(url_for(".generate_workout", result=response.choices[0].message))
    
#     result = request.args.get("result")
#     # print(result)
    
#     # db.session.add(new_exercise)
#     # db.session.commit()

#     # return make_response(jsonify(result), 200)
#     return result, 201