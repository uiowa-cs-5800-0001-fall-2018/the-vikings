import db_connections
from __init__ import app, jsonify

@app.route('/')
def homepage():
	return app.send_static_file('index.html')

@app.route("/pens/<pen_id>")
def data(pen_id):
	content = db_connections.get_pen(int(pen_id))

	return jsonify(content)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')