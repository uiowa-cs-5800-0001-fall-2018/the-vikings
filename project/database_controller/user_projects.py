import json
from project.database_controller.app import db
from project.models import Project


def get_project(project_id: int) -> json:
    """

    :param project_id:
    :return:
    """
    query_result = db.session.query(Project).filter(Project.id == project_id).all()

    if len(query_result) == 1:
        info = {
            "name" : query_result[0].name,
            "description" : query_result[0].description
        }
        return json.dumps(info)


    return "foo"