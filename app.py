from flask import Flask, jsonify
import db_connections
from models import db

app = Flask(__name__, static_url_path='')

POSTGRES = {
    'user': 'postgres',
    'pw': 'the-vikings',
    'db': 'the_vikings',
    'host': 'localhost',
    'port': '5432',
}

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:\%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:the-vikings@localhost/the_vikings'

db.init_app(app)

@app.route('/')
def homepage():
	return app.send_static_file('index.html')

@app.route("/pens/<pen_id>")
def data(pen_id):
	content = db_connections.get_pen(int(pen_id))

	return jsonify(content)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')