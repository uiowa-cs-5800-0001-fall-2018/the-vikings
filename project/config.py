class Config(object):
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:the-vikings@localhost/the_vikings'
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 4
    SECRET_KEY = 'very_secret_key_of_ours'