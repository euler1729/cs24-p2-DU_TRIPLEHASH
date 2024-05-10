import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token
from werkzeug.security import generate_password_hash

class ContractorManager(Resource):
    def get(self, user_id=None):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                requesting_user_id = info['sub']['user_id']
                role_id = info['sub']['role_id']

                # Check if accessed by admin
                if role_id != 1:
                    return make_response(jsonify({'msg': 'Unauthorized'}), 401)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                if user_id:
                    # Retrieve info of the contractor manager with the specified user_id
                    contractor_manager = cursor.execute('SELECT * FROM contractor_manager WHERE user_id = ?', (user_id,)).fetchone()
                    if not contractor_manager:
                        return make_response(jsonify({'msg': 'Contractor Manager not found!'}), 404)

                    # Construct a dictionary with contractor manager info
                    manager_info = {
                        'user_id': contractor_manager[0],
                        'full_name': contractor_manager[1],
                        'email': contractor_manager[2],
                        'date_of_creation': contractor_manager[3],
                        'contact_num': contractor_manager[4],
                        'assigned_contractor_company': contractor_manager[5],
                        'access_level': contractor_manager[6],
                        'username': contractor_manager[7]
                    }

                    return make_response(jsonify({'contractor_manager_info': manager_info}), 200)
                else:
                    cursor.execute('SELECT * FROM contractor_manager')
                    managers = cursor.fetchall()
                    if managers:
                        # Make every contractor manager as json and then send another json
                        data = []
                        for manager in managers:
                            manager_info = {
                                'user_id': manager[0],
                                'full_name': manager[1],
                                'email': manager[2],
                                'date_of_creation': manager[3],
                                'contact_num': manager[4],
                                'assigned_contractor_company': manager[5],
                                'access_level': manager[6],
                                'username': manager[7]
                            }
                            data.append(manager_info)
                        return make_response(jsonify({'contractor_managers': data}), 200)
                    else:
                        return make_response(jsonify({'msg': 'No Contractor Managers Found!'}), 404)
            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)


    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']
                role_id = info['sub']['role_id']

                # Check if accessed by admin or not
                if role_id != 1:
                    return make_response(jsonify({'msg': 'Unauthorized'}), 401)

                data = request.get_json()


                if 'full_name' not in data:
                    data['full_name'] = ''
                if 'date_of_creation' not in data:
                    data['date_of_creation'] = ''
                if 'contact_number' not in data:
                    data['contact_number'] = ''

                if 'email' not in data:
                    return make_response(jsonify({'msg':'Email is required!'}), 400)
                if 'username' not in data:
                    return make_response(jsonify({'msg':'User Name is required!'}), 400)
                if 'password' not in data:
                    return make_response(jsonify({'msg':'Password is required!'}), 400)  
                if 'access_level' not in data:
                    return make_response(jsonify({'msg':'Access level is required!'}), 400)  


                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if the username or email already exists
                existing_user = cursor.execute('SELECT * FROM contractor_manager WHERE username = ? OR email = ?', (data['username'], data['email'])).fetchone()
                if existing_user:
                    return make_response(jsonify({'msg': 'User with the same username or email already exists!'}), 409)

                cursor.execute('INSERT INTO contractor_manager (full_name, email, date_of_creation, contact_number, assigned_contractor_company, access_level, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                               (
                                   data['full_name'],
                                   data['email'], data['date_of_creation'],
                                   data['contact_number'], 
                                   data['assigned_contractor_company'], 
                                   data['access_level'], 
                                   data['username'], 
                                   generate_password_hash(data['password'])
                                ))


                conn.commit()

                return make_response(jsonify({'msg': 'Contractor Manager User Created!'}), 201)

            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': 'An error occurred while processing the request.'}), 500)
