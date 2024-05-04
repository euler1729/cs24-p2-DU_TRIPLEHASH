from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from werkzeug.security import generate_password_hash, check_password_hash

# Own defined modules
from database import Database
from utils import Utils


class Profile(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()
        
    # get method retriveving the user profile
    def get(self):
        try:
            # get the user info from the token
            info = self.utils.getInfoFromToken(request)
            if info:
                user_id = info['sub']['user_id']
                user = self.database.execute('SELECT user_id, user_name, email, role_id, name, age, phone_number FROM user where user_id = ?', (user_id, )).fetchone()
                self.database.commit()
                self.database.close()
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
            # get the user info from the token
            info = self.utils.getInfoFromToken(request)
            if info:
                user_id = info['sub']['user_id']
                data = request.get_json()
                role_id = info['sub']['role_id']

                self.database.execute('SELECT * FROM user WHERE user_id = ?', (user_id, ))
                exist_user = self.database.fetchone()
                
                if not exist_user:
                    return make_response(jsonify({'msg': 'User not found!'}), 404)

                # if password is in the data, then update the password
                if 'old_password' and 'new_password' in data:
                    db_pass = self.database.execute(
                        'SELECT password FROM user WHERE user_id = ?', (user_id, )
                    ).fetchone()
                    self.database.commit()
                    if check_password_hash(db_pass[0], data['old_password']):
                        self.database.execute('UPDATE user SET password = ? WHERE user_id = ?',
                                        (generate_password_hash(data['new_password']), user_id))
                        self.database.commit()                        
                    else:
                        return make_response(jsonify({'msg': 'Wrong Password!'}), 401)

                # if the following fields are not in the data, then use the existing data
                if 'email' not in data:
                    data['email'] = exist_user[2]
                if 'name' not in data:
                    data['name'] = exist_user[5]
                if 'age' not in data:
                    data['age'] = exist_user[6]
                if 'phone_number' not in data:
                    data['phone_number'] = exist_user[7]

                email = self.database.execute(
                    'SELECT email FROM user WHERE user_id = ?', (user_id,)).fetchone()
                self.database.commit()
                
                if email[0] != data['email']:
                    exist_email = self.database.execute(
                        'SELECT email FROM user WHERE email = ?', (data['email'],)).fetchone()
                    self.database.commit()
                    if exist_email:
                        return make_response(jsonify({'msg': 'Email already exists!'}), 409)

                self.database.execute('UPDATE user SET email = ?, name = ?, age = ?, phone_number = ? WHERE user_id = ?', (
                    data['email'], data['name'], data['age'], data['phone_number'], user_id))
                self.database.commit()
                return make_response(jsonify({'msg': 'Profile Updated!'}), 201)
            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
