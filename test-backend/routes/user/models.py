from dataclasses import dataclass
from extensions import db

@dataclass
class User(db.Model):
    id: int
    name: str
    email: str
    password: str
    token: str
    goal: str
    equipment: str
    height: int
    weight: int
    age: int
    fat: int
    workout: str
    injuries: str
    activities: str
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    token = db.Column(db.String)
    goal = db.Column(db.String(120))
    equipment = db.Column(db.String(2048))
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    age = db.Column(db.Integer)
    fat = db.Column(db.Integer)
    workout = db.Column(db.JSON)
    injuries = db.Column(db.String(2048))
    activities = db.Column(db.String(2048))

    # def __init__(self, name, email):
    #     self.name = name
    #     self.email = email

    # def __repr__(self):
    #     return '<User with name %r>' % self.username
