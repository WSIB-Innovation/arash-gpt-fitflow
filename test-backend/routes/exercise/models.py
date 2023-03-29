from dataclasses import dataclass
from extensions import db

@dataclass
class Exercise(db.Model):
    name: str
    sets: int
    reps: int
    pr: int
    desc: str
    
    name = db.Column(db.String(120), nullable=False, primary_key=True)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    pr = db.Column(db.Integer)
    desc = db.Column(db.String)

    def __init__(self, name, desc, reps, sets):
        self.name = name
        self.desc = desc
        self.reps = reps
        self.sets = sets

    def __repr__(self):
        return '<Exercise with name %r>' % self.name
