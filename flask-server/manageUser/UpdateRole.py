from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class UpdateRole(Resource):

    # put method for updating user's roles only admin
    def put(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                key = info.sub.user_id
                
                if(key != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)
                data = request.get_json()
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('UPDATE user SET role_id = ? WHERE id = ?', (data['role_id'], data['id']))
                conn.commit()
                return make_response(jsonify({'msg':'Role Updated!'}), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
