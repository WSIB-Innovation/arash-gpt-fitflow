from app import app
from extensions import db
import routes.user.models as user_models
import routes.exercise.models as exercise_models

with app.app_context():
    db.create_all()