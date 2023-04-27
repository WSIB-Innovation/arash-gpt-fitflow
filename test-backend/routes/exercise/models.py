from dataclasses import dataclass
from extensions import db


# @dataclass
# class Prtracker(db.Model):
#     id: int
#     record: int
#     date: str
#     exercise_name: str

#     id = db.Column(db.Integer, primary_key=True, nullable=False)
#     record = db.Column(db.Integer, nullable=False)
#     date = db.Column(db.String(120), nullable=False)
#     exercise_name = db.Column(db.String(120), db.ForeignKey('exercise.name'))

@dataclass
class Exercise(db.Model):
    name: str
    sets: int
    reps: int
    prs: str
    desc: str
    
    name = db.Column(db.String(120), nullable=False, primary_key=True)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    prs = db.Column(db.String(240))
    desc = db.Column(db.String)

    def __init__(self, name, desc, reps, sets):
        self.name = name
        self.desc = desc
        self.reps = reps
        self.sets = sets
        self.prs = ''
