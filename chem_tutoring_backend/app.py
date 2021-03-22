import os
import re
import json
import flask
import flask_cors
import flask_praetorian
from dotenv import load_dotenv
from flask import request, jsonify, session
from flask_cors import CORS, cross_origin
import jwt
from mongoengine import connect
import traceback
from mongoengine.queryset.visitor import Q
from Schemas.TutoringSession import TutoringSession
from Schemas.Message import Message
from Schemas.User import User
from datetime import *
from bson.objectid import ObjectId
from flask_mail import Mail;
from werkzeug.utils import secure_filename
from werkzeug.datastructures import ImmutableMultiDict
from flask import send_from_directory

UPLOAD_FOLDER = '/profile_pictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = "/NJIBYUGHBYUHIKNBJBYBTGYIUJNBGFB/"
CONNECTION = connect("testing", host=os.getenv("CONNECTION_STRING"))
CORS(app, support_credentials=True)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config["MAIL_USERNAME"] = "sotoemily03@gmail.com"
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_CONNECTION")
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}


UPLOAD_FOLDER = './profile_pictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

load_dotenv()

guard = flask_praetorian.Praetorian()
guard.init_app(app, User)

mail = Mail(app)

app.config["PRAETORIAN_EMAIL_TEMPLATE"] = './email.html'
app.config["PRATEORIAN_CONFIRMATION_SENDER"] = "sotoemily03@gmail.com"
app.config["PRAETORIAN_CONFIRMATION_URI"] = "localhost:3000/user/finalize_registration"
app.config["PRAETORIAN_CONFIRMATION_SUBJECT"] = "[JMSA Tutoring] Please Verify Your Account"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_dates(input_date_list):
    formatted_list = []
    for date_input in input_date_list:
        datetime_formatted = datetime.strptime(date_input, "%m/%d/%Y")
        formatted_list.append(datetime_formatted)
    return formatted_list;


@app.route('/user/<username>/sessions', methods=['GET'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def user_sessions(username):
    if "tutor" in flask_praetorian.current_user().rolenames:
        tutor_sessions = TutoringSession.objects(tutor__id=flask_praetorian.current_user().id).all()
    if "student" in flask_praetorian.current_user().rolenames:
        tutor_sessions = TutoringSession.objects(student__id=flask_praetorian.current_user().id).all()
    print(tutor_sessions)
    return tutor_sessions.to_json()

@app.route('/sessions', methods=['GET'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def all_sessions():
    tutor_sessions = TutoringSession.objects().all()
    return tutor_sessions.to_json()


@app.route('/user/sessions/new', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def create_session():
    try:
        tutoring_session = TutoringSession()
        datetime_formatted = datetime.strptime(request.json['date'], "%m/%d/%Y %I:%M %p")
        end_datetime_formatted = datetime.strptime(request.json['end_date'], "%m/%d/%Y %I:%M %p")

        tutoring_session.date = datetime_formatted
        tutoring_session.end_time = end_datetime_formatted
        tutoring_session.subject = request.json['subject']

        if "tutor" in flask_praetorian.current_user().roles:
            tutor = flask_praetorian.current_user()
            student = User.objects.get(username=request.json['other_user']['username'])
        else:
            student = flask_praetorian.current_user()
            tutor = User.objects.get(username=request.json['other_user']['username'])

        tutoring_session.tutor = {
            "id": tutor.id,
            "username": tutor.username
        }
        
        tutoring_session.student = {
            "id": student.id,
            "username": student.username
        }
        
        tutoring_session.save()
        tutor.sessions.append(tutoring_session)
        student.sessions.append(tutoring_session)

        tutor.save()
        student.save()
        return tutoring_session.to_json()
    except Exception as e:
        print(str(e))
        return str(e)


@app.route('/user/sessions/<id>/edit', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def session_edit(id):
    session_to_edit = TutoringSession.objects.get(id=id)

    if request.method == "POST":
            request.json['date'] = datetime.strptime(request.json['date'], "%m/%d/%Y %I:%M %p")
            session_to_edit.date=request.json['date']
            session_to_edit.subject = request.json['subject']
            session_to_edit.end_time = datetime.strptime(request.json['end_time'], "%m/%d/%Y %I:%M %p")
            session_to_edit.save()
            return session_to_edit.to_json();
    if request.method == "DELETE":
        session_to_edit.delete()
            
    if request.method == "GET":
        return session_to_edit.to_json()


@app.route('/user/<username>/chat/<recipient>', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def chat(username, recipient):
    try: 
       user = flask_praetorian.current_user()   
       if request.method=="POST":
           message = Message()
           message.sender = user.id
           message.recipient = ObjectId(request.json['recipient'])
           message.body = request.json['body']
           message.timestamp = datetime.now()
           message.save()

           recipient = User.objects.get(id=request.json['recipient'])
           recipient.messages.append(message)
           user.messages.append(message)
           user.save()
           recipient.save() 
           return message.to_json();
       elif request.method=="GET":
           return Message.objects.filter(Q(recipient=recipient) & Q(sender=user.id) | Q(sender=recipient) & Q(recipient=user.id)).to_json()
    except Exception as e:
        traceback.print_exc()
        return 'Invalid operation'

@app.route('/user/sign_in', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_page():
    try:
        if request.method == "POST":
            user = guard.authenticate(username=request.json['username'], password=request.json['password'])
            if(user and user.is_active):
                user.id = str(user.id)
                ret = {"access_token": guard.encode_jwt_token(user, override_access_lifespan=None, override_refresh_lifespan=None, bypass_user_check=False, is_registration_token=False, is_reset_token=False, username=user.username)}
                session['jwt_token'] = ret
                print(session['jwt_token'])
                return jsonify(ret)
        else:
            return "<h1>Invalid format. Try again<h1>"

    except Exception as e:
        print(e)
        return 'Invalid credentials', 401

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/user/sign_up', methods=['GET', 'POST'])
def api_sign_up():
    try:
        if request.method == 'POST':
            user = User()
            user.id=ObjectId()
            user.username = request.form.get('username')
            user.full_name = request.form.get('full_name')
            user.hashed_password = request.form.get('password')
            user.roles = request.form.get('roles')
            user.us_phone_number = request.form.get('us_phone_number')
            user.availability = parse_dates(request.form.getlist('availability'))
            user.email = request.form.get('email')
            user.biography = request.form.get('biography')
            profile_picture = request.files['profile_picture']

            if profile_picture and allowed_file(profile_picture.filename):
                filename = secure_filename(profile_picture.filename)
                profile_picture.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
                user.profile_picture = os.path.join(app.config['UPLOAD_FOLDER'],filename)

            guard.send_registration_email(user.email, user=user, confirmation_sender="sotoemily03@gmail.com", confirmation_uri="http://localhost:3000/finalize_registration" )
            user.save()
            return "Success"
    except Exception as e:
        print(e)
        return "Failure", 422


@app.route('/finalize', methods=['GET'])
def finalize():
    try:
        registration_token = guard.read_token_from_header()
        user = guard.get_user_from_registration_token(registration_token)
        user.is_active = True
        user.save()
        ret = {'access_token': guard.encode_jwt_token(user, override_access_lifespan=None, override_refresh_lifespan=None, bypass_user_check=False, is_registration_token=False, is_reset_token=False, username=user.username)}
        return (flask.jsonify(ret), 200)
    except Exception as e:
        print(e)
        return str(e)

@app.route('/send_password_email', methods=['POST'])
def send_email():
    try:
        return guard.send_reset_email(email=request.json['email'], reset_sender="sotoemily03@gmail.com", reset_uri="http://localhost:3000/reset_password")
    except Exception as e:
        print(e)
        return str(e)
        
@app.route('/reset_password', methods=['POST'])
def reset_password():
    try:
        reset_token = guard.read_token_from_header()
        print(reset_token)
        user = guard.validate_reset_token(reset_token)
        if(user):  
            user.hashed_password=guard.hash_password(request.json['password'])
            guard.verify_and_update(user=user, password=request.json['password'])
            user.save()
            return ('200')
    except Exception as e:
        print(e)
        return str(e)
        
@app.route('/user/<username>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user(username):
    user = User.objects.get(username=username)
    return user.to_json()

@app.route('/profile_pictures/<filename>', methods=['GET'])
def get_profile_picture(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],filename,  as_attachment=True)

@app.route('/user/<username>/edit', methods=['GET', 'POST', 'DELETE'])
@cross_origin(supports_credentials=True)
def user_edit(username):
    user_to_edit = User.objects.get(username=username)
    if request.method == "POST":

        user_to_edit.availability = parse_dates(request.json['availability']) if request.json['availability'] else user_to_edit.availability
        user_to_edit.username = request.json['username'] if request.json['username'] else user_to_edit.username
        user_to_edit.email = request.json['email'] if request.json['email'] else  user_to_edit.email
        user_to_edit.us_phone_number = request.json['us_phone_number'] if request.json['us_phone_number'] else user_to_edit.us_phone_number 
        user_to_edit.biography = request.json['biography'] if  request.json['biography'] else user_to_edit.biography
        user_to_edit.roles = request.json['roles'] if request.json['roles'] else  user_to_edit.roles

        user_to_edit.save()
        ret = {"access_token": guard.encode_jwt_token(user_to_edit, override_access_lifespan=None, override_refresh_lifespan=None, bypass_user_check=False, is_registration_token=False, is_reset_token=False, username=user_to_edit.username)}
        return jsonify(ret)

    if request.method == "DELETE":
        user_to_edit.delete()

    if request.method == "GET":
        return user_to_edit.to_json()


@app.route('/user/students', methods=['GET'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def student_all():
    students = User.objects(roles__contains='student').all()
    return students.to_json()

@app.route('/user', methods=['GET'])
@cross_origin(supports_credentials=True)
def user_all():
    users = User.objects().all()
    return users.to_json()


@app.route('/user/tutors', methods=['GET'])
@cross_origin(supports_credentials=True)
@flask_praetorian.auth_required
def tutor_all():
    tutors = User.objects(roles__contains='tutor').all()
    return tutors.to_json()


@app.route('/user/<username>/tutoring_history', methods=['GET'])
@cross_origin(supports_credentials=True)
def tutoring_history(username):
    try:
        user = User.objects.get(username=username)
        sessions = TutoringSession.objects(tutor__id=user.id).all()

        if(request.args.get('hours')):
            total = 0
            for session in sessions:
                total+=session.lengthInHours()
            return {'hours':total}
        else:
            return sessions.to_json()
    except Exception as e:
        traceback.print_exc()
        return 'Failure retrieving resources', 400


#is it worth having hours as a property
app.run(debug=True)
