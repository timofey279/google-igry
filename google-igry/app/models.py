from app import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    tag = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(100))
    password = db.Column(db.String(200))


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    folder = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))