import json
from . import db
from project.models import Project
from project.models import Stars

"""
Placeholder function to get pen XML content by id
"""

def get_pen(pen_id):
	if pen_id==1:
		xml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text_print" id="oN0%3l0rDEA(sHj1@Dkz" x="203" y="202"></block></xml>'
	else:
		xml = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="controls_if" id="lKrTH@hb`XF|)HV)M$6]" x="178" y="124"><mutation else="1"></mutation></block></xml>'

	return {"status": "success", "content": xml}


def get_project(project_id: int) -> json:
	"""

    :param project_id:
    :return:
    """
	query_result = db.session.query(Project).filter(Project.id == project_id).all()

	if len(query_result) == 1:
		info = {
			"name": query_result[0].name,
			"description": query_result[0].description
		}
		return json.dumps(info)

def star_it(user_id: int, project_id: int) -> json:
	"""

	    :param project_id:
	    :return:
	    """
	try:
		query_result = db.session.query(Project).filter(Project.id == project_id).all()
		query_result[0].num_stars = int(query_result[0].num_stars)+1
		stars_row = Stars(project_id=project_id, user_id=user_id)
		db.session.add(stars_row)
		db.session.flush()
		db.session.commit()
	except:
		db.session.rollback()
		raise Exception("Could not star")
	finally:
		db.session.close()