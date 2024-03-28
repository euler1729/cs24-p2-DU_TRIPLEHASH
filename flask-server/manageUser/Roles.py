from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class Roles(Resource):

    #get method for listing all available roles
    def get(self):
        try:
            print('RoleList')
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM roles ')
                roles = cursor.fetchall()
                all_roles = []
                for role in roles:
                    u = {
                        'role_id': role[0],
                        'role_name': role[1]
                    }
                    all_roles.append(u)
                return make_response(jsonify({'roles': all_roles}), 200)
                
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)