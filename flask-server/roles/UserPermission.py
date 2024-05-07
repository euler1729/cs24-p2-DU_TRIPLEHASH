from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from database import Database
from utils import Utils


class UserPermission(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()
    def get(self, user_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                user_role = info['sub']['role']
                roles_permissions = self.database.execute('SELECT * FROM role_permission WHERE role_id=?', (user_role,))
                user_permissions = self.database.execute('SELECT * FROM user_permission WHERE user_id=?', (user_id,))
                all_permissions = []
                for role_permission in roles_permissions:
                    permission = {
                        'permission_id': role_permission[1],
                        'permission_name': role_permission[2],
                        'permission_description': role_permission[3]
                    }
                    all_permissions.append(permission)
                for user_permission in user_permissions:
                    permission = {
                        'permission_id': user_permission[1],
                        'permission_name': user_permission[2],
                        'permission_description': user_permission[3]
                    }
                    if permission not in all_permissions:
                        all_permissions.append(permission)
                return make_response(jsonify({'permissions' : all_permissions}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
    def post(self, user_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                permission_id = data['permission_id']
                self.database.execute('INSERT INTO user_permission (user_id, permission_id) VALUES (?, ?)', (user_id, permission_id))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Permission Added!'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)