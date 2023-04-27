from flask import Blueprint, request, jsonify
from extensions import db
from .models import User
from uuid import uuid4
import json
import openai
from environs import Env

env = Env()
env.read_env()



blueprint = Blueprint("user", __name__, url_prefix='/users')
openai.api_key = env.str("OPENAI_API_KEY")
openai.api_type = "azure"
openai.api_base = "https://fitflow.openai.azure.com/"
openai.api_version = "2023-03-15-preview"

@blueprint.route('/<int:id>')
def get_user_by_id(id):
    user = User.query.get(id)
    return jsonify(user)

@blueprint.route('/login', methods=['GET','POST'])
def login_user():
    user_data = request.get_json()
    user = User.query.filter_by(email=user_data['email']).first()
    if user and user.password == user_data['password']:
        userToken = uuid4()
        user.token = userToken
        db.session.commit()
        return jsonify(token=str(userToken), id=user.id), 201
    else:
        return 'Login Failed', 401

@blueprint.route('/login/<int:id>')
def is_user_logged_in(id):
    user = User.query.get(id)
    if user:
        userToken = user.token
        return json.dumps(userToken == request.args.get('token'))
    else:
        return 'Login Failed', 401

@blueprint.route('/add_user', methods=['GET', 'POST'])
def post_user():
    user_data = request.get_json()

    new_user = User(name=user_data['name'], email=user_data['email'], password=user_data['password'])

    if(user_data['goal']):
        new_user.goal = user_data['goal']

    if(user_data['age']):
        new_user.age=user_data['age']

    if(user_data['height']):
        new_user.height=user_data['height']

    if(user_data['weight']):
        new_user.weight=user_data['weight']

    if(user_data['equipment']):
        new_user.equipment=user_data['equipment']

    userToken = uuid4()
    new_user.token = userToken

    db.session.add(new_user)
    db.session.commit()

    return jsonify(token=str(userToken), id=new_user.id), 201

@blueprint.route('/update_user/<int:id>', methods=['GET', 'POST'])
def update_user(id):
    user_data = request.get_json()

    user = User.query.get(id)
    if ("email" in user_data):
        user.email = user_data['email']
    if ('goal'  in user_data):
        user.goal = user_data['goal']
    if ('age'  in user_data):
        user.age = user_data['age']
    if ('height'  in user_data):
        user.height = user_data['height']
    if ('weight'  in user_data):
        user.weight = user_data['weight']
    if ('equipment'  in user_data):
        user.equipment = user_data['equipment']
    if ('name'  in user_data):
        user.name = user_data['name']
    if ('injuries'  in user_data):
        user.injuries = user_data['injuries']
    if ('activities'  in user_data):
        user.activities = user_data['activities']
    if ('workout'  in user_data):
        user.workout = json.dumps(user_data['workout'])
        
    db.session.commit()

    return jsonify(user), 201


@blueprint.route('/fitbot', methods=['GET'])
def askFitBot():
    messages = json.loads(request.args.get('messages'))

    response = openai.ChatCompletion.create(
        engine="gpt-35-turbo",
        messages=messages,
    )

    return response.choices[0].message, 201