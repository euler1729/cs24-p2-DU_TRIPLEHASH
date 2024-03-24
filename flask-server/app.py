import sqlite3

from flask import Flask, request, jsonify
# from flask_restful import Api

app = Flask(__name__)


@app.route('/', methods=['GET'])
def Users():
    return jsonify({'abc': 'abc'})

if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_reloader=True, port=8000)
