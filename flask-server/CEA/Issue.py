import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token

# Own defined modules
from database import Database
from utils import Utils

class Issue(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def post(self):
        info = self.utils.getInfoFromToken(request)
        # print(info)
        if info:
            data = request.get_json()
            location = data.get('location')
            issue_type = data.get('issue_type')
            description = data.get('description')
            # image = data.get('image')
            if not all([location, issue_type, description]):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)
            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute("INSERT INTO issue (location, issue_type, description) VALUES (?, ?, ?)", (location, issue_type, description))
                conn.commit()
                conn.close()
                return make_response(jsonify({'msg': 'Issue added successfully'}), 201)
            except Exception as e:
                return make_response(jsonify({'error': str(e)}), 500)