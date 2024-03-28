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
                if roles:
                    # send the role list as json
                    return make_response(jsonify({'roles': roles}), 200)
                else:
                    return make_response(jsonify({'msg':'No Roles Found!'}), 404)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)