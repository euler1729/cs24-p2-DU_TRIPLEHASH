from flask_restful import Resource
from flask import request, jsonify, make_response, Response
import sqlite3
from werkzeug.security import generate_password_hash
import jwt
import json
from check_token import check_token

class ChangePassword(Resource):

    def __init__(self):
        with open('config.json', 'r') as f:
            config = json.load(f)
            self.key = config['KEY']
            print(self.key)

    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = check_token(token)
            if info:
                print(info)
                data = request.get_json()
                old_password = data['old_password']
                new_password = data['new_password']
                return make_response(jsonify({'msg':'Password Changed!'}), 200)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)