from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from database import Database
from utils import Utils


class RolePermission(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()
    def get(self, role_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                roles_permissions = self.database.execute('SELECT * FROM role_permission WHERE role_id=?', (role_id,))
                all_permissions = []
                for role_permission in roles_permissions:
                    permission = {
                        'permission_id': role_permission[1],
                        'permission_name': role_permission[2],
                        'permission_description': role_permission[3]
                    }
                    all_permissions.append(permission)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
    def post(self, role_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                permission_id = data['permission_id']
                self.database.execute('INSERT INTO role_permission (role_id, permission_id) VALUES (?, ?)', (role_id, permission_id))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Permission Added!'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)