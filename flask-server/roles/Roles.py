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
                self.database.execute(
                    'SELECT role_name from role where role_name = ? ', (role_name,))
                role = self.database.fetchone()
                if role:
                    return make_response(jsonify({'msg': 'This role already exists'}))
                self.database.execute(
                    'INSERT INTO role (role_name) VALUES (?)', (role_name, ))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Role Created!'}), 201)
            return make_response(jsonify({'msg': 'Unauthorized!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def get(self, role_id=None):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                if role_id:
                    self.database.execute(
                        'SELECT * from role WHERE role_id = ? ', (role_id, ))
                    role = self.database.fetchone()
                    role = {
                        "role_id": role_id,
                        "role_name": role[1],
                    }
                    return make_response(jsonify({"role": role}), 200)

                self.database.execute('SELECT * FROM role ')
                roles = self.database.fetchall()
                res = []
                print(roles)
                for r in roles:
                    role = {
                        "role_id": r[0],
                        "role_name": r[1],
                    }
                    res.append(role)
                return make_response(jsonify({"roles": res}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def put(self, role_id=None):
        try:
            info = self.utils.getInfoFromToken(request)

            if info:
                if role_id is None:
                    return make_response(jsonify({'msg': 'No role id is given'}))
                data = request.get_json()
                role_name = data['role_name']
                self.database.execute(
                    'UPDATE role SET role_name = ? WHERE role_id = ? ', (role_name, role_id))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Role is updated sucessfully'}), 200)
            else:
                return make_response(jsonify({'msg': 'Unauthorized '}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def delete(self, role_id=None):
        info = self.utils.getInfoFromToken(request)
        try:
            if info:
                self.database.execute(
                    'DELETE FROM role where role_id = ?', (role_id,))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Role is deleted successfully'}))
            else:
                return make_response(jsonify({"msg": 'Unauthorized'}))
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
