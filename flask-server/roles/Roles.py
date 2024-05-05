from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from database import Database
from utils import Utils


class Roles(Resource):

    def __init__(self):
        self.database = Database()
        self.utils = Utils()


    def post(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                role_name = data['role_name']
                role_description = data['role_description']
                self.database.execute('INSERT INTO role (role_name, role_description) VALUES (?, ?)', (role_name,role_description))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Role Created!'}), 201)
            return make_response(jsonify({'msg': 'Unauthorized!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def get(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                self.database.execute('SELECT * FROM role')
                roles = self.database.fetchall()
                if roles:
                    return make_response(jsonify({'roles': roles}), 200)
                else:
                    return make_response(jsonify({'msg': 'No Roles Found!'}), 404)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)