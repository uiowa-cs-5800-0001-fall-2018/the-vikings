from project.models import Project, User
from project import bcrypt, db, app
from functools import wraps
from flask import abort, request, jsonify
import jwt
import json

def authorize(f):
	@wraps(f)
	def decorated_function(*args, **kws):
		print('qweqweqwe')
		if not 'Authorization' in request.headers:
			abort(401)

		auth_header = request.headers.get('Authorization')
		if auth_header:
			print('####')
			try:
				auth_token = auth_header.split(" ")[1]
			except IndexError:
				abort(401)
		else:
			print('###')
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
		description=post_data.get('description'),
		parent=None
	)

	db.session.add(project)
	db.session.commit() 
	
	return jsonify({"status": "success", "pid": project.id})


@app.route('/fork_project', methods=['POST'])
@authorize
def fork_project(user):
	post_data = request.get_json()
	query_result = db.session.query(Project).filter(Project.id == post_data.get('id')).all()

	if len(query_result) == 1:
		info = {
			"status": "success",
			"name" : query_result[0].name,
			"description" : query_result[0].description,
			"xml": query_result[0].xml
		}
		project = Project(
			owner=user['username'],
			name='Fork of ' + query_result[0].name,
			is_public=bool(query_result[0].is_public),
			description=query_result[0].description,
			xml=query_result[0].xml,
            parent=post_data.get('id')
		)

		db.session.add(project)
		db.session.commit() 
		
		return jsonify({"status": "success", "pid": project.id})
	else:
		return jsonify({"status": "fail"})


@app.route('/save_project', methods=['POST'])
@authorize
def save_project(user):
	post_data = request.get_json()
	p_id = post_data.get('p_id')
	content = post_data.get('content')

	res = save_project_helper(p_id, content, user)

	if res:
		return jsonify({"status":"success"})

	return jsonify({"status": "fail"})

@app.route('/saveas_project', methods=['POST'])
@authorize
def saveas_project(user):
	post_data = request.get_json()
	query_result = db.session.query(Project).filter(Project.id == post_data.get('id')).all()

	if len(query_result) == 1:
		project = Project(
			owner=user['username'],
			name= post_data.get('name'),
			is_public=bool(query_result[0].is_public),
			description=post_data.get('desc'),
			xml=query_result[0].xml,
			parent=None
			
		)

		db.session.add(project)
		db.session.commit()
		
		return jsonify({"status": "success", "pid": project.id})
	else:
		return jsonify({"status": "fail"})


@app.route("/projects/<project_id>")
def project_data(project_id):
	content = get_project(int(project_id))

	return content

@app.route("/user/<owner>")
def projects_data(owner):
	return get_projects(owner)

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
			"xml": query_result[0].xml,
			"parent": query_result[0].parent
		}
		return json.dumps(info)


	return "foo"


def get_projects(owner):
	query_result = db.session.query(Project).filter(Project.owner == owner).all()

	respond = []
	for res in query_result:
		info = {
			"id": res.id,
			"name" : res.name,
			"description" : res.description,
			"xml": res.xml,
			"owner": res.owner,
			"datetime": str(res.last_modified),
			"num_stars": res.num_stars,
			"parent": res.parent
		}
		respond.append(info)

	
	respond.reverse()
	respond = {"status":"success", "data": respond}

	return json.dumps(respond)


def save_project_helper(p_id, content, submitter):
	query_result = db.session.query(Project).filter(Project.id == p_id).first()
	if query_result.owner == submitter['username']:
		query_result.xml = content
		db.session.commit() 
	
		return True

	return False
