import time
from flask_restful import Resource
from flask import request, jsonify, make_response, Response
from werkzeug.security import generate_password_hash

# Own defined modules
from sendmail import send_otp
from database import Database
from utils import Utils

'''
    @endpoint '/auth/reset-password-init'
'''
class ResetPasswordInit(Resource):
    
    def __init__(self):
        self.database = Database()
        self.utils = Utils()
    
    def post(self):
        try:
            data = request.get_json()
            user_name = data['user_name'].lower()

            # Check if the user exists
            user = self.database.execute(
                'SELECT user_id, user_name, email FROM user WHERE user_name=? OR email=?', 
                (user_name, user_name)
            ).fetchone()
            self.database.commit()
            # If user exists, send OTP
            if user:
                send_otp(user[0], user[2])
                return make_response(jsonify({'msg':'An OTP for password reset has been sent to your registered email'}), 200)
            else:
                return make_response(jsonify({'msg':'User not found'}), 404)
        except Exception as e:
            return make_response(jsonify({'msg':'An error occurred'}), 500)
        
'''
    @endpoint '/auth/reset-password-confirm'
'''
class ResetPasswordConfirm(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def post(self):
        # Get request parameters
        data = request.get_json()
        user_name = data['user_name']
        otp = data['otp']
        new_password = data['new_password']
        new_password_hash = generate_password_hash(new_password)

        # Check if username or email exists in the user table
        user_row = self.database.execute(
            'SELECT user_id FROM user WHERE user_name=? OR email=?', 
            (user_name, user_name)
        ).fetchone()
        self.database.commit()

        # If user exists
        if user_row:
            user_id = user_row[0]
            # Check if the OTP matches for the user
            otp_row = self.database.execute(
                'SELECT * FROM otp WHERE user_id = ? AND otp = ?', 
                (user_id, otp)
            ).fetchone()
            self.database.commit()

            # If OTP matches
            if otp_row:
                # Check if the OTP has expired
                if otp_row[2] < int(time.time() * 1000):
                    self.database.close()
                    return make_response(jsonify({'msg': 'OTP expired'}), 400)
                self.database.execute("UPDATE user SET password = ? WHERE user_id = ?", (new_password_hash, user_id,))
                self.database.execute("DELETE FROM otp WHERE user_id = ?", (user_id,))
                self.database.commit()
                self.database.close()
                return make_response(jsonify({'msg': 'Password updated successfully'}), 200)
            else:
                self.database.close()
                return make_response(jsonify({'msg': 'Invalid OTP'}), 400)
        else:
            conn.close()
            return make_response(jsonify({'msg': 'User not found'}), 404)