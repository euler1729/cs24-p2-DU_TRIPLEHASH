from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from database import Database
from utils import Utils


class Permission(Resource):

    def __init__(self):
        self.database = Database()
        self.utils = Utils()


    def get(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                self.database.execute('SELECT * FROM permissions')
                permissions = self.database.fetchall()
                if permissions:
                    return make_response(jsonify({'permissions': permissions}), 200)
                else:
                    return make_response(jsonify({'msg': 'No Permissions Found!'}), 404)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
    def post(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                permission_name = data['permission_name']
                permission_description = data['permission_description']
                self.database.execute('INSERT INTO permissions (permission_name, permission_description) VALUES (?, ?)', (permission_name,permission_description))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Permission Created!'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
    