from flask import Flask
from flask_cors import CORS
from extensions import db
from routes import user
from routes import exercise


def create_app(config_object="settings"):
    app = Flask(__name__)
    app.config.from_object(config_object)
    register_extensions(app)
    register_blueprints(app)
    CORS(app)
    return app

def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    return None

def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(user.views.blueprint)
    app.register_blueprint(exercise.views.blueprint)
    return None

app=create_app()

# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"


if __name__ == "__main__":    
    app.run()

