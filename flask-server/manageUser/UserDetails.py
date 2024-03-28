from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class UserDetails(Resource):

    #get method for retrieving a user details
    def get(self, userId):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            roleIdHead = info['sub']['role_id']
            print(userId)
            if info:
                if roleIdHead != 1:
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM user WHERE user_id = ?', (userId,))
                user = cursor.fetchone()
                if user:
                    return make_response(jsonify({'user': user}), 200)
                else:
                    return make_response(jsonify({'msg':'No Users Found!'}), 404)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
            
    #put method for updating a user details
    def post(self, userId): 
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
                cursor.execute('UPDATE user SET user_name = ?, password = ?, email = ?, role_id = ?, name = ?, age = ?, phoneNumber = ? WHERE id = ?', (data['user_name'], generate_password_hash(data['password']), data['email'], data['role_id'], data['name'], data['age'], data['phoneNumber'], userId))
                conn.commit()
                return make_response(jsonify({'msg':'User Updated!'}), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
    
    #delete method for deleting a user
    def delete(self, userId):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                key = info['key']
                if(key != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('DELETE FROM user WHERE id = ?', (userId,))
                conn.commit()
                return make_response(jsonify({'msg':'User Deleted!'}), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)

