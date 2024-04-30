from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from werkzeug.security import generate_password_hash, check_password_hash

# Own defined modules
from database import Database
from utils import Utils

'''
    @endpoint '/auth/change-password'
'''
class ChangePassword(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def post(self):
        '''
            Change the password of the user
            @endpoint '/auth/change-password'
            @param: old_password, new_password, confirm_password
            @return: 200, {'msg':'Password Changed!'}
            @return: 401, {'msg':'Wrong Credentials!'}
        '''
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                user_id = info['sub']['user_id']
                data = request.get_json()
                old_password = data['old_password']
                new_password = data['new_password']
                confirm_password = data['confirm_password']
                if new_password != confirm_password:
                    return make_response(jsonify({'msg':'Password does not match!'}), 401)

                self.database.execute('SELECT * FROM user WHERE user_id=?', (user_id,))
                user = self.database.fetchone()
                if user:
                    hash = user[3]
                    if not check_password_hash(hash, old_password):
                        return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
                    new_hash = generate_password_hash(new_password)
                    self.database.execute('UPDATE user SET password=? WHERE user_id=?', (new_hash, user_id))
                    self.database.commit()
                    self.database.close()
                    
                return make_response(jsonify({'msg':'Password Changed!'}), 200)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)