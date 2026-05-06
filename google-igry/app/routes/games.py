import os, zipfile
from flask import Blueprint, render_template, request, redirect, current_app
from flask_login import login_required, current_user
from app.models import Game
from app import db

games_bp = Blueprint("games", __name__)

@games_bp.route("/upload", methods=["GET", "POST"])
@login_required
def upload():
    if request.method == "POST":
        title = request.form["title"]
        file = request.files["game_zip"]

        folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "games", title)
        os.makedirs(folder, exist_ok=True)

        zip_path = os.path.join(folder, "game.zip")
        file.save(zip_path)

        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(folder)

        os.remove(zip_path)

        game = Game(title=title, folder=title, user_id=current_user.id)
        db.session.add(game)
        db.session.commit()

        return redirect("/")

    return render_template("upload.html")


@games_bp.route("/play/<int:game_id>")
def play(game_id):
    game = Game.query.get_or_404(game_id)
    return render_template("play.html", game=game)

@games_bp.route("/my-games")
@login_required
def my_games():
    games = Game.query.filter_by(user_id=current_user.id).all()
    return render_template("my_games.html", games=games)

@games_bp.route("/delete/<int:game_id>")
@login_required
def delete_game(game_id):
    game = Game.query.get_or_404(game_id)

    if game.user_id != current_user.id:
        return "Нет доступа"

    path = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        "games",
        game.folder
    )

    import shutil
    shutil.rmtree(path, ignore_errors=True)

    db.session.delete(game)
    db.session.commit()

    return redirect("/my-games")