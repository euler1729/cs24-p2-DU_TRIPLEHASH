from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class Users(Resource):

    #get method to get all the users - admin
    def get(self):
        try:
            print('UserList')
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']
                role_id = info['sub']['role_id']
                if(role_id != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM user ')
                user = cursor.fetchall()
                if user:
                    # make every user as json and then send another json
                    data = []
                    for u in user:
                        print(u)
                        u = {
                            'user_id': u[0],
                            'user_name': u[1],
                            'email': u[2],
                            'role_id': u[4],
                            'name': u[5],
                            'age': u[6],
                            'phone_number': u[7]
                        }
                        data.append(u)
                    return make_response(jsonify({'users': data}), 200)
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
                role_id = info['sub']['role_id']
                if(role_id != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)

                if 'name' not in data:
                    data['name'] = ''
                if 'age' not in data:
                    data['age'] = ''
                if 'phone_number' not in data:
                    data['phone_number'] = ''

                if 'role_id' not in data:
                    return make_response(jsonify({'msg':'Role Id is required!'}), 400)
                if 'user_name' not in data:
                    return make_response(jsonify({'msg':'User Name is required!'}), 400)
                if 'password' not in data:
                    return make_response(jsonify({'msg':'Password is required!'}), 400)    


                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                exist_user = cursor.execute('SELECT * FROM user WHERE user_name = ? or email = ?', (data['user_name'], data['email'])).fetchone()
                if exist_user:
                    return make_response(jsonify({'msg':'User Already Exists!'}), 409)
                else:
                    cursor.execute('INSERT INTO user (user_name, password, email, role_id, name, age, phone_number) VALUES (?,?,?,?,?,?,?)', (data['user_name'], generate_password_hash(data['password']), data['email'], data['role_id'], data['name'], data['age'], data['phone_number']))
                    conn.commit()
                return make_response(jsonify({'msg':'User Created!'}), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
