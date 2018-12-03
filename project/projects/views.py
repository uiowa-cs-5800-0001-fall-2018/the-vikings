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


@app.route('/search', methods=['POST'])
def search():
	post_data = request.get_json()
	q = post_data.get("query")
	projects = db.session.query(Project).filter(Project.name.like("%{0}%".format(q)))
	users = db.session.query(User).filter(User.username.like("%{0}%".format(q)))
	response = {"projects":[], "users":[]}

	for user in users:
		response["users"].append({"username": user.username})

	for project in projects:
		response["projects"].append({"name": project.name, "id": project.id})

	return jsonify(response)

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

@app.route('/remove_project', methods=['POST'])
@authorize
def remove_project(user):
	post_data = request.get_json()
	p_id = post_data.get('p_id')

	query_result = db.session.query(Project).filter(Project.id == p_id).first()
	if query_result.owner == user['username']:
		db.session.query(Project).filter(Project.id == p_id).delete()
		db.session.commit() 

		res = True

	else:
		res = False

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


@app.route("/parents/<project_id>")
def parents(project_id):
	pid = int(project_id)
	cur = db.session.query(Project).filter(Project.id == pid).first()

	parents = []

	if cur.parent:
		parent = db.session.query(Project).filter(Project.id == cur.parent).first()
		parents.append([cur.parent, parent.name])
		loop = True
	else:
		loop=False

	while loop:
		cur = db.session.query(Project).filter(Project.id == cur.parent).first()
		
		if cur.parent:
			parent = db.session.query(Project).filter(Project.id == cur.parent).first()
			parents.append([cur.parent, parent.name])
		else:
			loop = False


	return parents

@app.route("/children/<project_id>")
def children(project_id):
	pid = int(project_id)
	query_result = db.session.query(Project).filter(Project.parent == pid).all()

	children = []
	for res in query_result:
		children.append([res.id, res.name])


	return children

@app.route("/projects/<project_id>")
def project_data(project_id):
	content = get_project(int(project_id))

	return content

@app.route("/user/<owner>")
def projects_data(owner):
	return json.dumps({"owner": get_projects(owner), "public": get_public_projects(owner)})

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
			"owner": query_result[0].owner,
			"description" : query_result[0].description,
			"xml": query_result[0].xml,
			"parent": query_result[0].parent,
			"parents": parents(project_id),
			"children": children(project_id)
		}
		return info


	return "foo"


def get_projects(owner):
	query_result = db.session.query(Project).filter(Project.owner == owner).order_by(Project.last_modified).all()

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

def get_public_projects(owner):
	query_result = db.session.query(Project).filter(Project.is_public == True, Project.owner != owner).all()

	respond = []
	for res in query_result:
		info = {
			"id": res.id,
			"name" : res.name,
			"description" : res.description,
			"xml": res.xml,
			"owner": res.owner,
			"datetime": str(res.last_modified),
			"num_stars": res.num_stars
		}
		respond.append(info)

	
	respond.reverse()
	respond = {"status":"success", "data": respond}

	return respond


def save_project_helper(p_id, content, submitter):
	query_result = db.session.query(Project).filter(Project.id == p_id).first()
	if query_result.owner == submitter['username']:
		query_result.xml = content
		db.session.commit() 
	
		return True

	return False

