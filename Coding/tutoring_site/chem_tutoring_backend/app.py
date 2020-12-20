import os
import re

import flask
import flask_cors
import flask_praetorian
from dotenv import load_dotenv
from flask import request, jsonify, session
from flask_cors import CORS, cross_origin
from mongoengine import connect
import traceback

from Schemas.TutoringSession import TutoringSession
from Schemas.User import User
from datetime import *

app = flask.Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SECRET_KEY'] = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'
CONNECTION = connect("testing", host=os.getenv("CONNECTION_STRING"))

CORS(app, support_credentials=True)


app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
load_dotenv()

guard = flask_praetorian.Praetorian()
guard.init_app(app, User)


def parse_dates(input_date_list):
    formatted_list = []
    for date_input in input_date_list:
        datetime_formatted = datetime.strptime(date_input, "%m/%d/%Y")
        formatted_list.append(datetime_formatted);
    return formatted_list;


@app.route('/user/<username>/sessions', methods=['GET'])
@flask_praetorian.auth_required
def all_sessions():
    if "tutor" in flask_praetorian.current_user().rolenames:
        tutor_sessions = TutoringSession.objects(tutor=flask_praetorian.current_user()._id).all()
    if "student" in flask_praetorian.current_user().rolenames:
        tutor_sessions = TutoringSession.objects(student=flask_praetorian.current_user()._id).all()
    return tutor_sessions.to_json()


@app.route('/user/sessions/new', methods=['GET', 'POST'])
@flask_praetorian.auth_required
def create_session():
    try:
        tutoring_session = TutoringSession()
        datetime_formatted = datetime.strptime(request.json['data'], "%m/%d/%Y %I:%M %p")
        tutoring_session.date = datetime_formatted
        tutoring_session.subject = request.json['subject']

        if "tutor" in flask_praetorian.current_user().roles:
            tutoring_session.tutor = flask_praetorian.current_user()
            tutoring_session.student = User.objects.get(username=request.json['other_user.data'])
        else:
            tutoring_session.student = flask_praetorian.current_user()
            tutoring_session.tutor = User.objects.get(username=request.json['other_user.data'])
        tutoring_session.save()

        tutoring_session.tutor.sessions.append(tutoring_session)
        tutoring_session.student.sessions.append(tutoring_session)

        tutoring_session.tutor.save()
        tutoring_session.student.save()
        return tutoring_session.to_json()
    except Exception as e:
        return str(e)


@app.route('/user/sessions/<id>/edit', methods=['GET', 'POST'])
@flask_praetorian.auth_required
def session_edit(id):
    session_to_edit = TutoringSession.objects.get(id=id)

    if request.method == "POST":
        if request.json['date']:
            request.json['date'] = datetime.strptime(request.json['date'], "%m/%d/%Y %I:%M %p")
            session_to_edit.save()
            return session_to_edit.to_json();
    if request.method == "DELETE":
        session_to_edit.delete()

    if request.method == "GET":
        return session_to_edit.to_json()


@app.route('/user/protected', methods=['GET', 'POST'])
@flask_praetorian.auth_required
def protected():
    print(flask_praetorian.current_user().rolenames)
    return flask.jsonify(message="protected endpoint (allowed user roles {})".
                         format(flask_praetorian.current_user().rolenames[1])
                         )


@app.route('/user/tutor/dashboard', methods=['GET'])
@flask_praetorian.roles_required('tutor')
def authorized_tutor():
    print(flask_praetorian.current_user().username)
    return flask.jsonify(flask_praetorian.current_user().username)


@app.route('/user/sign_in', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_page():
    try:
        if request.method == "POST":
            user = guard.authenticate(username=request.json['username'], password=request.json['password'])
            user.id = str(user.id)
            ret = {"access_token": guard.encode_jwt_token(user)}
            session['jwt_token'] = jsonify(ret)
            return (jsonify(ret))
        else:
            return "<h1>Invalid format. Try again<h1>"

    except Exception as e:
        traceback.print_exc()
        return "Exception: " + str(e)


@app.route('/user/sign_up', methods=['GET', 'POST'])
def api_sign_up():
    try:
        if request.method == 'POST':
            user = User(
                full_name=request.json['full_name'],
                email=request.json['email'],
                username=request.json['username'],
                hashed_password=guard.hash_password(request.json['password']),
                us_phone_number=request.json['us_phone_number'],
                biography=request.json['biography'],
                roles=request.json['roles'],
                availability=parse_dates(request.json['availability'].split(", ")),
                is_active=True
            )

            # if "tutor" in user.roles:
            #     user.meeting_link = request.json['meeting_link']

            user.save()
            return user.to_json()
        else:
            return """THIS IS A GET REQUEST!"""

    except Exception as e:
        return str(e)


@app.route('/user/<username>', methods=['GET'])
def get_user(username):
    user = User.objects.get(username=username)
    return user.to_json()


@app.route('/user/<username>/edit', methods=['GET', 'POST', 'DELETE'])
def user_edit(username):
    user_to_edit = User.objects.get(username=username)
    if request.method == "POST":
        if request.form.getlist('availability'):
            availabilities = request.form.getlist('availability')
            parse_dates(availabilities)

            user_to_edit.full_name = request.json['full_name'],
            user_to_edit.email = request.json['email'],
            user_to_edit.username = request.json['username'],
            user_to_edit.us_phone_number = request.json['us_phone_number'],
            user_to_edit.biography = request.json['biography'],
            user_to_edit.availability = parse_dates(request.json['availability'].split(", ")),

        user_to_edit.save()
        return user_to_edit.to_json()

    if request.method == "DELETE":
        user_to_edit.delete()

    if request.method == "GET":
        return user_to_edit.to_json()


@app.route('/tutors', methods=['GET'])
@flask_praetorian.roles_required('admin')
def tutor_all():
    tutors = User.objects(roles__contains='tutor').all()
    return tutors.to_json()


app.run(debug=True)
