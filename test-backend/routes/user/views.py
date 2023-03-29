from flask import Blueprint, request, jsonify
from extensions import db
from .models import User
from uuid import uuid4
import json

blueprint = Blueprint("user", __name__, url_prefix='/users')

@blueprint.route("/")
def hello():
    print("123")
    print(type(db))
    return "Hello World!"

@blueprint.route('/<int:id>')
def get_user_by_id(id):
    user = db.get_or_404(User, id)
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
    userToken = user.token
    return json.dumps(userToken == request.args.get('token'))

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
    user.email = user_data['email']
    user.goal = user_data['goal']
    user.age=user_data['age']
    user.height=user_data['height']
    user.weight=user_data['weight']
    user.equipment=user_data['equipment']

    db.session.commit()

    return jsonify(user), 201