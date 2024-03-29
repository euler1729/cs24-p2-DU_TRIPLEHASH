from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token


class Profile(Resource):

    # get method retriveving the user profile
    def get(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute(
                    'SELECT user_id, user_name, email, role_id, name, age, phone_number FROM user where user_id = ?', (user_id, ))
                user = cursor.fetchone()
                print(user)
                if user:
                    # make every user as json and then send another json
                    u = {
                        'user_id': user[0],
                        'user_name': user[1],
                        'email': user[2],
                        'role_id': user[3],
                        'name': user[4],
                        'age': user[5],
                        'phone_number': user[6]
                    }
                    return make_response(jsonify({'users': u}), 200)
                else:
                    return make_response(jsonify({'msg': 'No Users Found!'}), 404)
            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)

    # put method for updating a user details
    def put(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            if info:
                user_id = info['sub']['user_id']
                data = request.get_json()
                role_id = info['sub']['role_id']

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                exist_user = cursor.execute(
                    'SELECT * FROM user WHERE user_id = ?', (user_id,)).fetchone()

                if not exist_user:
                    return make_response(jsonify({'msg': 'User not found!'}), 404)

                if 'old_password' and 'new_password' in data:
                    db_pass = cursor.execute(
                        'SELECT password FROM user WHERE user_id = ?', (user_id,)).fetchone()
                    if check_password_hash(db_pass[0], data['old_password']):
                        cursor.execute('UPDATE user SET password = ? WHERE user_id = ?',
                                       (generate_password_hash(data['new_password']), user_id))
                        conn.commit()
                    else:
                        return make_response(jsonify({'msg': 'Wrong Password!'}), 401)

                if 'email' not in data:
                    data['email'] = exist_user[2]
                if 'name' not in data:
                    data['name'] = exist_user[5]
                if 'age' not in data:
                    data['age'] = exist_user[6]
                if 'phone_number' not in data:
                    data['phone_number'] = exist_user[7]

                email = cursor.execute(
                    'SELECT email FROM user WHERE user_id = ?', (user_id,)).fetchone()
                if email[0] != data['email']:
                    exist_email = cursor.execute(
                        'SELECT email FROM user WHERE email = ?', (data['email'],)).fetchone()
                    if exist_email:
                        return make_response(jsonify({'msg': 'Email already exists!'}), 409)

                cursor.execute('UPDATE user SET email = ?, name = ?, age = ?, phone_number = ? WHERE user_id = ?', (
                    data['email'], data['name'], data['age'], data['phone_number'], user_id))
                conn.commit()
                return make_response(jsonify({'msg': 'Profile Updated!'}), 201)
            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
