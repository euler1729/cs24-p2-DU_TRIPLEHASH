from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash

# Own defined moduless
from database import Database
from utils import Utils

class Registration(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()
    
    def post(self):
        '''
            Register the user
            @endpoint '/auth/register'
            @param: user_name, email, password, role_id, name, age, phone_number
            @return: 200, {'msg':'registered successfully'}
            @return: 401, {'msg':'user already exists'}
        '''
        try:
            data = request.get_json()
            user_name = data['user_name'].lower()
            email = data['email']
            password = data['password']
            role_id = 5 # user role_id is 5
            name = data['name']
            ward_number = data['ward_number']
            # age = data['age']
            # phone_number = data['phone_number']
            
            user = self.database.execute(
                'SELECT * FROM user WHERE user_name=? OR email=?', (user_name, email)
            ).fetchone()
            self.database.commit()
            
            if user:
                return make_response(jsonify({'msg':'user already exists'}), 401)
            else:
                hash = self.utils.hash_password(password)
                self.database.execute(
                    'INSERT INTO user (user_name, email, password, role_id, name) VALUES (?,?,?,?,?)',
                    (user_name, email, hash, role_id, name)
                )
                self.database.commit()
                user = self.database.execute(
                    'SELECT user_id FROM user WHERE email=?', (email,)
                ).fetchone()
                self.database.commit()
                self.database.execute(
                    'INSERT INTO user_ward (user_id, ward_number) VALUES (?,?)',
                    (user[0], ward_number)
                )
                self.database.commit()
                return make_response(jsonify({'msg':'registered successfully'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)