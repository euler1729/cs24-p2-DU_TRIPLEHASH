from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from datetime import timedelta
from flask_jwt_extended import JWTManager
import json

# auth
from auth.Login import Login, Logout
from auth.ChangePassword import ChangePassword
from auth.ResetPassword import ResetPasswordInit, ResetPasswordConfirm


# Data entry
from data_entry.data_entry import Vehicle


with open('config.json', 'r') as f:
    config = json.load(f)
    key = config['KEY']

app = Flask(__name__)
app.secret_key = key

app.config['JWT_SECRET_KEY'] = key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=10)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']


cors = CORS(app,
            resources={r"*": {
                    "origins": "*"
                }
            },
            supports_credentials=True,
        )
api = Api(app)
JWT = JWTManager(app)



# auth
api.add_resource(Login, '/auth/login')
api.add_resource(Logout, '/auth/logout')
api.add_resource(ChangePassword, '/auth/change-password')
api.add_resource(ResetPasswordInit, '/auth/reset-password/init')
api.add_resource(ResetPasswordConfirm, '/auth/reset-password/confirm')


# Data Entry
api.add_resource(Vehicle, '/data-entry/add-vehicle')


if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_reloader=True, host='0.0.0.0', port=8000)
