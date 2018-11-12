from project.models import Project, User
from project import bcrypt, db, app
from functools import wraps
from flask import abort, request, jsonify
import jwt
import json

def authorize(f):
	@wraps(f)
	def decorated_function(*args, **kws):
		if not 'Authorization' in request.headers:
			abort(401)

		auth_header = request.headers.get('Authorization')
		if auth_header:
			try:
				auth_token = auth_header.split(" ")[1]
			except IndexError:
				abort(401)
		else:
			auth_token = ''

		if auth_token:
			print("qwe",auth_token, "qwe")
			resp = User.decode_auth_token(auth_token)
			if not isinstance(resp, str):
				user = User.query.filter_by(id=resp).first()
				responseObject = {
						'user_id': user.id,
						'email': user.email,
						'username': user.username,
						'admin': user.admin,
						'registered_on': user.registered_on
				}
				return f(responseObject, *args, **kws)
			else:
				abort(401)
	return decorated_function


@app.route('/create_project', methods=['POST'])
@authorize
def create_project(user):
	post_data = request.get_json()
	project = Project(
		owner=user['username'],
		name=post_data.get('name'),
		is_public=bool(post_data.get('is_public')),
		description=post_data.get('description')
	)

	db.session.add(project)
	db.session.commit()
	
	return jsonify({"status": "success", "pid": project.id})

@app.route("/projects/<project_id>")
def project_data(project_id):
	content = get_project(int(project_id))

	return content


def get_project(project_id: int) -> json:
	"""
	:param project_id:
	:return:
	"""
	query_result = db.session.query(Project).filter(Project.id == project_id).all()

	if len(query_result) == 1:
		info = {
			"status": "success",
			"name" : query_result[0].name,
			"description" : query_result[0].description,
			"xml": query_result[0].xml
		}
		return json.dumps(info)


	return "foo"