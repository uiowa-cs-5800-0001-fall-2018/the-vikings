from project import db_connections
from project.database_controller.user_projects import get_project
from flask import jsonify
from project.database_controller.app import app

@app.route('/')
def homepage():
	return app.send_static_file('index.html')

@app.route("/pens/<pen_id>")
def data(pen_id):
	content = db_connections.get_pen(int(pen_id))

	return jsonify(content)

@app.route("/projects/<project_id>")
def project_data(project_id):
	content = get_project(int(project_id))

	return content

if __name__ == '__main__':
    app.run(debug=True)