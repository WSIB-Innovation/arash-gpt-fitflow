from environs import Env

env = Env()
env.read_env()

SQLALCHEMY_DATABASE_URI = env.str("DATABASE_URL")
UPLOAD_FOLDER = './temp/'