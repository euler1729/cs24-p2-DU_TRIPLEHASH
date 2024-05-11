import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token

# Own defined modules
from database import Database
from utils import Utils

class ThirdPartyContractor(Resource):
    
    #get all contractors or retrieve info of a specific contractor by contract_id
    def get(self, contract_id=None):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']
                role_id = info['sub']['role_id']

                # Check if accessed by admin or not
                if(role_id != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 401)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                if contract_id:
                    # Retrieve info of the contractor with the specified contract_id
                    contractor = cursor.execute('SELECT * FROM third_party_contractor WHERE contract_id = ?', (contract_id,)).fetchone()
                    if not contractor:
                        return make_response(jsonify({'msg': 'Contractor not found!'}), 404)

                    # Construct a dictionary with contractor info
                    contractor_info = {
                        'contract_id': contractor[0],
                        'reg_id': contractor[1],
                        'company_name': contractor[2],
                        'tin': contractor[3],
                        'contact_num': contractor[4],
                        'workforce_size': contractor[5],
                        'payment_per_ton': contractor[6],
                        'waste_amount_per_day': contractor[7],
                        'contract_duration': contractor[8],
                        'collection_area': contractor[9],
                        'designated_sts': contractor[10]
                    }

                    return make_response(jsonify({'contractor_info': contractor_info}), 200)
                else:
                    cursor.execute('SELECT * FROM third_party_contractor')
                    user = cursor.fetchall()
                    if user:
                        # make every contractor as json and then send another json
                        data = []
                        for u in user:
                            print("user:\n", u)
                            u = {
                                'contract_id': u[0],
                                'reg_id': u[1],
                                'company_name': u[2],
                                'tin': u[3],
                                'contact_num': u[4],
                                'workforce_size': u[5],
                                'payment_per_ton': u[6],
                                'waste_amount_per_day' : u[7],
                                'contract_duration' : u[8],
                                'collection_area' : u[9],
                                'designated_sts' : u[10]
                            }
                            data.append(u)
                        return make_response(jsonify({'contractors': data}), 200)
                    else:
                        return make_response(jsonify({'msg':'No Contractor Found!'}), 404)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)



    # post method for creating a new user admin
    def post(self): 
        try:
            token = request.headers['Authorization'].split(' ')[1]
            
            # contains info about authorizor
            info = decode_token(token)
            if info:

                # Check if the action is done by admin
                user_id = info['sub']['user_id']
                data = request.get_json()
                role_id = info['sub']['role_id']
                if(role_id != 1):
                    return make_response(jsonify({'msg':'Unauthorized'}), 403)


                # keep blank if data not found
                if 'company_name' not in data:
                    data['company_name'] = ''
                if 'workforce_size' not in data:
                    data['workforce_size'] = ''
                if 'contact_num' not in data:
                    data['contact_num'] = ''
                if 'payment_per_ton' not in data:
                    data['payment_per_ton'] = ''
                if 'waste_amount_per_day' not in data:
                    data['waste_amount_per_day'] = ''
                if 'contract_duration' not in data:
                    data['contract_duration'] = ''
                if 'collection_area' not in data:
                    data['collection_area'] = ''
                if 'tin' not in data:
                    data['tin'] = ''

                # Mandatory data
                if 'reg_id' not in data:
                    return make_response(jsonify({'msg':'Registration ID is required!'}), 400)
                if 'designated_sts' not in data:
                    return make_response(jsonify({'msg':'Designated STS ID is required!'}), 400)     

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check whether the contractor already exists
                # Addition check to see if the tin number matches
                exist_contractor = cursor.execute('SELECT * FROM third_party_contractor WHERE reg_id = ?', (data['reg_id'],)).fetchone()
                if exist_contractor:
                    return make_response(jsonify({'msg':'Third party Contractor Already Exists!'}), 409)
                else:
                    cursor.execute('INSERT INTO third_party_contractor (reg_id, company_name, tin, contact_num, workforce_size, payment_per_ton, waste_amount_per_day, contract_duration, collection_area, designated_sts) VALUES (?,?,?,?,?,?,?,?,?,?)', 
                    (
                        data['reg_id'], 
                        data['company_name'], 
                        data['tin'], 
                        data['contact_num'], 
                        data['workforce_size'], 
                        data['payment_per_ton'], 
                        data['waste_amount_per_day'],
                        data['contract_duration'],
                        data['collection_area'],
                        data['designated_sts']
                    ))
                    conn.commit()
                return make_response(jsonify({'msg':'Contractor Created!'}), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 403)
        except Exception as e:
            # Log the error
            print(e)
            # Return a generic error message
            return make_response(jsonify({'msg': 'An error occurred while processing the request.'}), 500)



    # for updating contractor info
    def put(self, contract_id):
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

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if the contractor exists
                contractor = cursor.execute('SELECT * FROM third_party_contractor WHERE contract_id = ?', (contract_id,)).fetchone()
                if not contractor:
                    return make_response(jsonify({'msg': 'Contractor not found!'}), 404)

                # Update contractor info
                cursor.execute('UPDATE third_party_contractor SET company_name=?, tin=?, contact_num=?, workforce_size=?, payment_per_ton=?, waste_amount_per_day=?, contract_duration=?, collection_area=?, designated_sts=? WHERE contract_id=?',
                               (data.get('company_name', contractor[2]),
                                data.get('tin', contractor[3]),
                                data.get('contact_num', contractor[4]),
                                data.get('workforce_size', contractor[5]),
                                data.get('payment_per_ton', contractor[6]),
                                data.get('waste_amount_per_day', contractor[7]),
                                data.get('contract_duration', contractor[8]),
                                data.get('collection_area', contractor[9]),
                                data.get('designated_sts', contractor[10]),
                                contract_id))
                conn.commit()

                return make_response(jsonify({'msg': 'Contractor info updated successfully!'}), 200)

            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': 'An error occurred while processing the request.'}), 500)

    # for deleting contractor info
    def delete(self, contract_id):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                user_id = info['sub']['user_id']
                role_id = info['sub']['role_id']

                # Check if accessed by admin or not
                if role_id != 1:
                    return make_response(jsonify({'msg': 'Unauthorized'}), 401)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if the contractor exists
                contractor = cursor.execute('SELECT * FROM third_party_contractor WHERE contract_id = ?', (contract_id,)).fetchone()
                if not contractor:
                    return make_response(jsonify({'msg': 'Contractor not found!'}), 404)

                # Delete contractor info
                cursor.execute('DELETE FROM third_party_contractor WHERE contract_id = ?', (contract_id,))
                conn.commit()

                return make_response(jsonify({'msg': 'Contractor info deleted successfully!'}), 200)

            return make_response(jsonify({'msg': 'Wrong Credentials!'}), 401)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': 'An error occurred while processing the request.'}), 500)
