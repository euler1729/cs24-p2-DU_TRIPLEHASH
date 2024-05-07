from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from database import Database
from utils import Utils


class Permission(Resource):

    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def post(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                permission_name = data['permission_name']
                permission_desc = data['permission_desc']
                self.database.execute(
                    'SELECT permission_name from permission where permission_name = ? ', (permission_name,))
                permission = self.database.fetchone()
                if permission:
                    return make_response(jsonify({'msg': 'This permission already exists'}))
                self.database.execute(
                    'INSERT INTO permission (permission_name, permission_desc) VALUES (?, ?)', (permission_name, permission_desc))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'permission Created!'}), 201)
            return make_response(jsonify({'msg': 'Unauthorized!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def get(self, permission_id=None):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                if permission_id:
                    self.database.execute(
                        'SELECT * from permission WHERE permission_id = ? ', (permission_id, ))
                    permission = self.database.fetchone()
                    permission = {
                        "permission_id": permission_id,
                        "permission_name": permission[1],
                        "permission_desc": permission[2],
                    }
                    return make_response(jsonify({"permission": permission}), 200)

                self.database.execute('SELECT * FROM permission ')
                permission = self.database.fetchall()
                res = []
                for r in permission:
                    permission = {
                        "permission_id": permission_id,
                        "permission_name": permission[1],
                        "permission_desc": permission[2],
                    }
                    res.append(permission)
                return make_response(jsonify({"permission": res}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def put(self, permission_id=None):
        try:
            info = self.utils.getInfoFromToken(request)

            if info:
                if permission_id is None:
                    return make_response(jsonify({'msg': 'No permission id is given'}))
                data = request.get_json()
                permission_name = data['permission_name']
                permission_desc = data['permission_desc']
                self.database.execute(
                    'UPDATE permission SET permission_name = ?, permission_desc = ? WHERE permission_id = ? ', (permission_name, permission_desc, permission_id))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'permission is updated sucessfully'}), 200)
            else:
                return make_response(jsonify({'msg': 'Unauthorized '}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def delete(self, permission_id=None):
        info = self.utils.getInfoFromToken(request)
        try:
            if info:
                self.database.execute(
                    'DELETE FROM permission where permission_id = ?', (permission_id,))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'permission is deleted successfully'}))
            else:
                return make_response(jsonify({"msg": 'Unauthorized'}))
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
