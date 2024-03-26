from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from sendmail import send_otp
import sqlite3
import time
from werkzeug.security import generate_password_hash

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
        # Get request parameters
        data = request.get_json()
        user_name = data['user_name']
        otp = data['otp']
        new_password = data['new_password']
        new_password_hash = generate_password_hash(new_password)

        # Connect to the database
        conn = sqlite3.connect('sqlite.db')
        cursor = conn.cursor()

        # Check if username or email exists in the user table
        cursor.execute("SELECT user_id FROM user WHERE user_name = ? OR email = ?", (user_name, user_name))
        user_row = cursor.fetchone()

        if user_row:
            user_id = user_row[0]
            # Check if the OTP matches for the user
            cursor.execute("SELECT * FROM otp WHERE user_id = ? AND otp = ?", (user_id, otp,))
            otp_row = cursor.fetchone()

            if otp_row:
                if otp_row[2] < int(time.time() * 1000):
                    conn.close()
                    return make_response(jsonify({'msg': 'OTP expired'}), 400)
                cursor.execute("UPDATE user SET password = ? WHERE user_id = ?", (new_password_hash, user_id,))
                cursor.execute("DELETE FROM otp WHERE user_id = ?", (user_id,))
                conn.commit()
                conn.close()
                return make_response(jsonify({'msg': 'Password updated successfully'}), 200)
            else:
                conn.close()
                return make_response(jsonify({'msg': 'Invalid OTP'}), 400)
        else:
            conn.close()
            return make_response(jsonify({'msg': 'User not found'}), 404)