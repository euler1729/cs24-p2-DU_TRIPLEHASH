from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class ChangePassword(Resource):

    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']
                data = request.get_json()
                old_password = data['old_password']
                new_password = data['new_password']

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM user WHERE user_id=?', (user_id,))
                user = cursor.fetchone()
                if user:
                    hash = user[3]
                    if not check_password_hash(hash, old_password):
                        return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)

                    new_hash = generate_password_hash(new_password)
                    cursor.execute('UPDATE user SET password=? WHERE user_id=?', (new_hash, user_id))
                    conn.commit()
                    conn.close()
                return make_response(jsonify({'msg':'Password Changed!'}), 200)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)