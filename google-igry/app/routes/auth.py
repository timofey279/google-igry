from flask import Blueprint, render_template, request, redirect, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user
from app.models import User
from app import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        user = User(
            email=request.form["email"],
            tag=request.form["tag"],
            username=request.form["username"],
            password=generate_password_hash(request.form["password"])
        )
        db.session.add(user)
        db.session.commit()

        login_user(user)
        return redirect("/")

    return render_template("register.html")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        login_input = request.form["login"]
        password = request.form["password"]

        user = User.query.filter(
            (User.email == login_input) | (User.tag == login_input)
        ).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect("/")

        flash("Неверные данные", "error")
        return redirect("/login")

    return render_template("login.html")


@auth_bp.route("/logout")
def logout():
    logout_user()
    return redirect("/")
