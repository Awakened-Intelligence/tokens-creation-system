from flask import Flask
from flask_pymongo import PyMongo
from config import Config

app = Flask(__name__)
app.config["MONGO_URI"] = Config.MONGO_URI  

# MongoDB Initialization
mongo = PyMongo(app)
db = mongo.db



