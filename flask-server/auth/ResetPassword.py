from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from sendmail import send_otp
import sqlite3


class ResetPasswordInit(Resource):
    def post(self):
        try:
            data = request.get_json()
            user_name = data['user_name'].lower()

            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()
            cursor.execute('SELECT user_id, user_name, email FROM user WHERE user_name=? OR email=?', (user_name, user_name))
            user = cursor.fetchone()
            conn.close()
            if user:
                send_otp(user[0], user[2])
                return make_response(jsonify({'msg':'An OTP for password reset has been sent to your registered email'}), 200)
            else:
                return make_response(jsonify({'msg':'User not found'}), 404)
        except Exception as e:
            return make_response(jsonify({'msg':'An error occurred'}), 500)
class ResetPasswordConfirm(Resource):
    def post(self):
        return make_response(jsonify({'msg':'Reset Password confirm- post'}), 200)