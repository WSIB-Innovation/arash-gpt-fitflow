from flask import Blueprint, request, jsonify, make_response, url_for, redirect
from extensions import db
from .models import Exercise
from .inital import initExercises
from ..user.models import User
import openai
import json

blueprint = Blueprint("exercise", __name__, url_prefix='/exercises')

openai.api_key = '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'

@blueprint.route("/", methods=['GET'])
def get_exercises():
    exercises = Exercise.query.all()
    return jsonify(exercises)

@blueprint.route('/<name>', methods=['GET'])
def get_exercise_by_name(name):
    exercise = db.get_or_404(Exercise, name)
    return jsonify(exercise)

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
        print(exercise_data)
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

    # message = "The following exercises are the database of exercises you are allowed to use. Create me a workout focussing on "
    # if (data['injury']):
    #     message += "injury rehabilitation of a(n) "
    # message = message + data['query'] + " using only exercises from this list. Return a JSON object where each entry outlines the name, sets and reps of each exercise. Finally, have the last object be a message with any additional comments if any. The exercise list is: " + exercise_list

    message = "Create me a workout focussing on "
    if (data['injury']):
        message += "injury rehabilitation of a(n) "
    message = message + data['query'] + ' Return a JSON object where each entry outlines the name, sets and reps of each exercise. Finally, have the last object be a message with any additional comments if any. The format should look like this: {"exercises": [{"name": "Dips", "sets":3, "reps":3}], "message": "x"}'

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}],
    )

    print(response.choices[0].message)

    responseJSON = json.loads(response.choices[0].message.content)

    print(responseJSON['exercises'])

    for exercise in responseJSON['exercises']:
        print(exercise)
        name = exercise['name']
        print(name)
        dbObj = Exercise.query.get(name)
        if not dbObj:
            exerciseDesc = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Give me a short description on the exercise " + name}],
            )
            print(exerciseDesc)
            
            new_exercise = Exercise(name=exercise['name'], reps=exercise['reps'], sets=exercise['sets'], desc=exerciseDesc.choices[0].message.content)
            db.session.add(new_exercise)
            db.session.commit()

        # user = User.query.get()



    return response.choices[0].message, 201




# @blueprint.route('/generate_workout', methods=['GET', 'POST'])
# def generate_workout():
#     exercises = Exercise.query.all()
#     exercise_list = ''
#     for exercise in exercises:
#       exercise_list + exercise.name + ', '
#     jsonExercises = jsonify(exercises)

#     print(jsonExercises)

#     if request.method == "POST":
#       response = openai.ChatCompletion.create(
#           model="gpt-3.5-turbo",
#           messages=[{"role": "user", "content": "Using the following exercises, create me a workout focussing on Push day: " + exercise_list}],
#       )
#       # print(response)
#       print(response)
#       print(jsonify(response))
#       print(response['choices'][0]['message']['content'])
#       return redirect(url_for(".generate_workout", result=response.choices[0].message))
    
#     result = request.args.get("result")
#     print(result)
    
#     # db.session.add(new_exercise)
#     # db.session.commit()

#     # return make_response(jsonify(result), 200)
#     return result, 201