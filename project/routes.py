from flask import jsonify
from __init__ import app

@app.route('/')
def homepage():
	return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
