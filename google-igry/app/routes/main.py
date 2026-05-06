from flask import Blueprint, render_template, request
from app.models import Game

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
    q = request.args.get("q")

    if q:
        games = Game.query.filter(Game.title.contains(q)).all()
    else:
        games = Game.query.all()

    return render_template("index.html", games=games, q=q)