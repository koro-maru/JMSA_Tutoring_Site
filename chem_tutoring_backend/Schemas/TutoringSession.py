from mongoengine import *
from datetime import *


class TutoringSession(Document):
    date = DateTimeField()
    # tutor = ReferenceField("User")
    # student = ReferenceField("User")

    tutor = DictField()
    student = DictField()
    subject = StringField()

