from flask_restful import Resource
from flask import request, jsonify, make_response, Response

class ResetPasswordInit(Resource):
    def post(self):
        return make_response(jsonify({'msg':'Reset Password init- post'}), 200)
    
class ResetPasswordConfirm(Resource):
    def post(self):
        return make_response(jsonify({'msg':'Reset Password confirm- post'}), 200)