from project import db_connections
from flask import jsonify
from project import app

@app.route('/')
def homepage():
	return app.send_static_file('index.html')


@app.route("/pens/<pen_id>")
def data(pen_id):
	content = db_connections.get_pen(int(pen_id))

	return jsonify(content)

@app.route("/projects/<project_id>")
def data_project(project_id):
	content = db_connections.get_project(int(project_id))

	return content

@app.route("/stars/<project_id>/<user_id>")
def stars_data(user_id,project_id):
	db_connections.star_it(int(user_id), int(project_id))

	return "1"
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
