from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
import sqlite3

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            user_name = data['user_name'].lower()
            password = data['password']

            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM user WHERE user_name=? OR email=?', (user_name, user_name))
            user = cursor.fetchone()
            conn.close()
            
            if user:
                hash = user[3]
                if not check_password_hash(hash, password):
                    return make_response(jsonify({'msg':'invalid credentials'}), 401)
                access_token = create_access_token(identity={'user_id': user[0], 'role_id': user[4]})
                user = {
                    'user_id': user[0],
                    'user_name': user[1],
                    'email': user[2],
                    'role_id': user[4]
                }
                return make_response(jsonify({'user':user, 'access_token':access_token}), 200)
            else:
                return make_response(jsonify({'msg':'invalid credentials'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
    
class Logout(Resource):
    def get(self):
        return make_response(jsonify({'msg':'logged out'}), 200)