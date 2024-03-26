from flask_restful import Resource
from flask import request, jsonify, make_response, Response

class ChangePassword(Resource):
    def post(self):
        return make_response(jsonify({'msg':'change password-post'}), 200)