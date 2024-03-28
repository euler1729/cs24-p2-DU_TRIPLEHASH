from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class Users(Resource):

    #get method to get all the users - admin
    def get(self):
        try:
            # print('UserList')
            # token = request.headers['Authorization'].split(' ')[1]
            # info = decode_token(token)
            return None, 200
            if info:
                user_id = info['sub']['user_id']
                data = request.get_json()
                key = info['key']

                if(key != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM user ')
                user = cursor.fetchone()
                if user:
                    # make every user as json and then send another json
                    user = [dict(zip([key[0] for key in cursor.description], user))]
                    return make_response(jsonify({'users': user}), 200)
                else:
                    return make_response(jsonify({'msg':'No Users Found!'}), 404)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
        
    # post method for creating a new user admin
    def post(self): 
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']
                data = request.get_json()
                key = info['key']

                if(key != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('INSERT INTO user (user_name, password, email, role_id, name, age, phoneNumber) VALUES (?,?,?,?)', (data['user_name'], generate_password_hash(data['password']), data['email'], data['role_id'], data['name'], data['age'], data['phoneNumber']))
                conn.commit()
                return make_response(jsonify({'msg':'User Created!'}), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
