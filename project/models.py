import datetime
from project.database_controller.app import bcrypt, db, app


class BaseModel(db.Model):
    """Base data model for all objects"""

    __abstract__ = True

    def __init__(self, *args):
        super().__init__(*args)

    def __repr__(self):
        """Define a base way to print models"""
        return '%s(%s)' % (self.__class__.__name__, {
            column: value
            for column, value in self._to_dict().items()
        })

    def json(self):
        """
                Define a base way to jsonify models, dealing with datetime objects
        """
        return {
            column: value if not isinstance(value, datetime.date) else value.strftime('%Y-%m-%d')
            for column, value in self._to_dict().items()
        }


# class Kamyon(BaseModel, db.Model):
#     """Model for the users table"""

#     __tablename__ = 'kamyon'

#     id = db.Column(db.Integer, primary_key = True)
#     name = db.Column(db.String)
#     project = db.Column(db.String)


class User(BaseModel, db.Model):
    """ User Model for storing user related details """
    __tablename__ = "users"
    # __table_args__ = {'extend_existing': True} 

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, email, password, admin=False):
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()
        self.registered_on = datetime.datetime.now()
        self.admin = admin


class Project(BaseModel, db.Model):
    """ Project Model for storing project related details """
    __tablename__ = "projects"
    # __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner = db.Column(db.String(), nullable=False)
    xml = db.Column(db.String())
    name = db.Column(db.String(256), nullable=False)
    description =db.Column(db.String())
    is_public = db.Column(db.Boolean, default=False)
    last_modified = db.Column(db.DateTime, nullable=False)
    num_stars = db.Column(db.Integer, default=False)

    def __init__(self,
                 id,
                 owner,
                 name,
                 is_public,
                 description="",
                 ):
        self.id = id
        self.owner = owner
        self.description = description
        self.is_public = is_public
        self.name = name
        self.last_modified = datetime.datetime.now()
        self.num_stars = 0
