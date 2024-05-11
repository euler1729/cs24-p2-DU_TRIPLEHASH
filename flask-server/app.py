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
from auth.Registration import Registration

# User Management
from manage_user_info.Users import Users
from manage_user_info.UserDetails import UserDetails
from manage_user_info.Roles import Roles
#from manage_user_info.UpdateRole import UpdateRole
from manage_user_info.Profile import Profile
from trip.MakeTrip import MakeTrip

#Trip
from trip.MakeTrip import MakeTrip
from trip.Trip import Trip
from trip.ActiveTrip import ActiveTrip

# Route
from route.GetRoute import GetRoute
from route.Fleet import Fleet
from route.STSVehicle import STSVehicle

# Data entry
from data_entry.AddDumpEntry import AddDumpEntry
from data_entry.AddSTSVehicleEntry import AddSTSVehicleEntry
from data_entry.Vehicle import (
    AddVehicle,
    UpdateVehicle,
    DeleteVehicle,
    GetAllVehicles
)
from data_entry.AssignManager import AssignManager
from data_entry.AssignSTSVehicles import AssignSTSVehicles
from data_entry.GetSTS import GetSTS
from data_entry.LandfillSite import CreateLandfillSite
from data_entry.STS import (
    CreateSTS,
    UpdateSTS,
    GetSTSVehicleList,
    GetAllSTS
)
from data_entry.GetUserList import GetAllData

# Roles and permission
from roles.Roles import Roles
from roles.Permissions import Permission
from roles.UserPermission import UserPermission
from roles.RolePermission import RolePermission

# CM and employee

from contractor.Employee import Employee
from contractor.Collection import Collection

from CEA.Issue import Issue



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
api.add_resource(Registration, '/auth/register')
api.add_resource(ChangePassword, '/auth/change-password')
api.add_resource(ResetPasswordInit, '/auth/reset-password/init')
api.add_resource(ResetPasswordConfirm, '/auth/reset-password/confirm')


api.add_resource(Users, '/users')
api.add_resource(UserDetails, '/users/<int:userId>')
#api.add_resource(Roles, '/users/roles')
#api.add_resource(UpdateRole, '/users/<int:userId>/roles')
api.add_resource(Profile, '/profile')

# Route
api.add_resource(GetRoute, '/route')
api.add_resource(Fleet, '/sts/fleet')

#Trip
api.add_resource(Trip, '/trip')
api.add_resource(ActiveTrip, '/activetrip')
api.add_resource(MakeTrip, '/maketrip')
api.add_resource(STSVehicle, '/sts/vehicle')


# Roles and permission
api.add_resource(Roles, '/roles', '/roles/<int:role_id>')
api.add_resource(Permission, '/permission', '/permission/<int:permission_id>')
api.add_resource(UserPermission, '/user/permission', '/user/permission/<int:user_id>')
api.add_resource(RolePermission, '/role/permission', '/role/permission/<int:role_id>')



# Data Entry
api.add_resource(AddVehicle, '/data-entry/add-vehicle')
api.add_resource(CreateSTS, '/data-entry/create-sts')
api.add_resource(AssignManager, '/data-entry/assign-manager')
api.add_resource(AssignSTSVehicles, '/data-entry/assign-sts-vehicles')
api.add_resource(AddSTSVehicleEntry, '/data-entry/add-sts-vehicle-entry')
api.add_resource(CreateLandfillSite, '/data-entry/create-landfill-site')
# api.add_resource(AssignLandfillManagers, '/data-entry/assign-landfill-managers')
api.add_resource(AddDumpEntry, '/data-entry/add-dump-entry')

# Get STS, Vehicle List, STS Vehicle List, STS List
api.add_resource(GetSTS, '/sts')
api.add_resource(GetAllData, '/data-entry/get-user-list')
api.add_resource(GetAllVehicles, '/data-entry/get-vehicle-list')
api.add_resource(GetSTSVehicleList, '/data-entry/get-sts-vehicle-list')
api.add_resource(GetAllSTS, '/data-entry/get-sts-list')


api.add_resource(DeleteVehicle, '/data-entry/delete-vehicle/<int:vehicle_id>')
api.add_resource(UpdateVehicle, '/data-entry/update-vehicle/<int:vehicle_id>')

api.add_resource(UpdateSTS, '/data-entry/update-sts/<int:sts_id>')


api.add_resource(Issue, '/issue')

#CM and employee

api.add_resource(Employee, '/contractor/employee', '/contractor/employee/<int:employee_id>')

if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_reloader=True, host='0.0.0.0', port=8000)
