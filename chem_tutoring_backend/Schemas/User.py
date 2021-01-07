from mongoengine import *
from bson.json_util import loads, dumps

allowed_roles = ["admin", "tutor", "student"]


class User(Document):
    full_name = StringField(required=True)
    email = EmailField(required=True)
    username = StringField(unique=True, required=True)
    us_phone_number = StringField(required=False)
    hashed_password = StringField(required=True)
    sessions = ListField(ReferenceField("TutoringSession"), default=list)
    availability = ListField(DateTimeField(), required=False)
    biography = StringField(required=False)
    roles = StringField(required=False)
    is_active = BooleanField()

    @property
    def identity(self):
        return dumps(self.id)

    @property
    def rolenames(self):
        try:
            role_list = self.roles.split(",")
            if set(role_list).issubset(set(allowed_roles)):
                return role_list
        except Exception:
            return []

    @property
    def password(self):
        return self.hashed_password

    @classmethod
    def lookup(cls, username):
        try:
            return User.objects(username=username).get()
        except DoesNotExist:
            return None

    @classmethod
    def identify(cls, id):
        try:
            return User.objects(id=loads(id)).get()
        except DoesNotExist:
            return None

    def is_valid(self):
        return self.is_active
