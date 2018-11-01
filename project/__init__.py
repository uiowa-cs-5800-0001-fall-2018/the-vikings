import sys
sys.path.append("..")

from flask import Flask, jsonify
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from project.config import Config

db = SQLAlchemy()
app = Flask(__name__, static_url_path='')
app.config.from_object(Config)
bcrypt = Bcrypt(app)
db.init_app(app)

from project.auth.views import auth_blueprint
app.register_blueprint(auth_blueprint)