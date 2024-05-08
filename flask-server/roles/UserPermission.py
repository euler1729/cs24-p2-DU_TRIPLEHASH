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
                user_role = info['sub']['role_id']
                roles_permissions = self.database.execute(
                    'SELECT * FROM role_permission WHERE role_id=?', (user_role,)).fetchall()
                user_permissions = self.database.execute(
                    'SELECT * FROM user_permission WHERE user_id=?', (user_id,)).fetchall()
                all_permissions = []
                print(roles_permissions)
                print(user_permissions)
                for p in roles_permissions:
                    permission = {
                        'permission_id': p[0],
                    }
                    all_permissions.append(permission)
                for p in user_permissions:
                    permission = {
                        'permission_id': p[0],
                    }
                    if permission not in all_permissions:
                        all_permissions.append(permission)
                return make_response(jsonify({'permissions': all_permissions}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def post(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                user_id = data['role_id']
                permission_id = data['permission_id']
                self.database.execute(
                    'INSERT INTO user_permission (user_id, permission_id) VALUES (?, ?)', (user_id, permission_id))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Permission Added!'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def delete(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                self.database.execute(
                    'DELETE FROM user_permission where permission_id = ? and user_id = ? ', (data['permission_id'], data['user_id']))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Permission is deleted'}))

            else:
                return make_response(jsonify({'msg': 'Unauthorized'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
