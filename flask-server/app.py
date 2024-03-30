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
from manageUser.Users import Users
from manageUser.UserDetails import UserDetails
from manageUser.Roles import Roles
from manageUser.UpdateRole import UpdateRole
from manageUser.Profile import Profile

# Route
from route.getRoute import GetRoute
from route.Fleet import Fleet

# Data entry
from data_entry.AddDumpEntry import AddDumpEntry
from data_entry.AddSTSVehicleEntry import AddSTSVehicleEntry
from data_entry.AddVehicle import AddVehicle
from data_entry.AssignLandfillManagers import AssignLandfillManagers
from data_entry.AssignSTSManagers import AssignSTSManagers
from data_entry.AssignSTSVehicles import AssignSTSVehicles
from data_entry.CreateLandfillSite import CreateLandfillSite
from data_entry.CreateSTS import CreateSTS

from data_entry.GetUserList import GetAllUsers



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


api.add_resource(Users, '/users')
api.add_resource(UserDetails, '/users/<int:userId>')
api.add_resource(Roles, '/users/roles')
api.add_resource(UpdateRole, '/users/<int:userId>/roles')
api.add_resource(Profile, '/profile')

# Route
api.add_resource(GetRoute, '/route')
api.add_resource(Fleet, '/sts/fleet')

# Data Entry
api.add_resource(AddVehicle, '/data-entry/add-vehicle')
api.add_resource(CreateSTS, '/data-entry/create-sts')
api.add_resource(AssignSTSManagers, '/data-entry/assign-sts-managers')
api.add_resource(AssignSTSVehicles, '/data-entry/assign-sts-vehicles')
api.add_resource(AddSTSVehicleEntry, '/data-entry/add-sts-vehicle-entry')
api.add_resource(CreateLandfillSite, '/data-entry/create-landfill-site')
api.add_resource(AssignLandfillManagers, '/data-entry/assign-landfill-managers')
api.add_resource(AddDumpEntry, '/data-entry/add-dump-entry')

api.add_resource(GetAllUsers, '/data-entry/get-user-list')



if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_reloader=True, host='0.0.0.0', port=8000)
