from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from TokenManager import decode_token

class getSTS(Resource):
    def get(self):
        try:
            
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                role_id = info['sub']['role_id']
                user_id = info['sub']['user_id']
                
                if(role_id != 2):
                    return make_response(jsonify({'msg':'You are not an sts Manager'}), 401)
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT sts_id FROM sts_managers WHERE user_id = ?', (user_id,))
                sts = cursor.fetchone()
                cursor.execute('SELECT waste FROM sts WHERE sts_id = ?', (sts[0],))
                waste = cursor.fetchone()
                conn.commit()
                return make_response(jsonify({"sts_id": sts[0], "waste" : waste[0], }), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)