import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token

# Own defined modules
from database import Database
from utils import Utils


# For STS
class CreateSTS(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def get(self):
        try:
            info = self.utils.getInfoFromToken(request)

            # TODO: NEED TO IMPLEMENT DYNAMIC ROLE BASED ACCESS CONTROL
            if info:
                role_id = info['sub']['role_id']
                user_id = info['sub']['user_id']
                
                if(role_id != 2):
                    return make_response(jsonify({'msg':'You are not an sts Manager'}), 401)
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('SELECT sts_id FROM sts_managers WHERE user_id = ?', (user_id,))
                sts = cursor.fetchone()
                cursor.execute('SELECT capacity_tonnes FROM sts WHERE sts_id = ?', (sts[0],))
                waste = cursor.fetchone()
                conn.commit()
                return make_response(jsonify({"sts_id": sts[0], "waste" : waste[0], }), 201)
            return make_response(jsonify({'msg':'Wrong Credentials!'}), 401)
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)
    
    # Creates a new STS site
    def post(self):
        info = self.utils.getInfoFromToken(request)

        # @TODO: NEED TO IMPLEMENT DYNAMIC ROLE BASED ACCESS CONTROL
        if info and (info['sub']['role_id'] == 1 or info['sub']['role_id'] == 2):
            
            data = request.get_json()

            ward_number = data.get('ward_number')
            capacity_tonnes = data.get('capacity_tonnes')
            gps_longitude = data.get('gps_longitude')
            gps_latitude = data.get('gps_latitude')

            if not all([ward_number, capacity_tonnes, gps_longitude, gps_latitude]):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)

            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if STS with the same ward number already exists
                cursor.execute("SELECT * FROM sts WHERE ward_number = ?", (ward_number,))
                existing_sts = cursor.fetchone()
                if existing_sts:
                    return make_response(jsonify({'error': 'STS with the same ward number already exists'}), 400)

                # Insert STS data
                cursor.execute("""INSERT INTO sts 
                                (ward_number, capacity_tonnes, gps_longitude, gps_latitude)
                                VALUES (?, ?, ?, ?)""",
                            (ward_number, capacity_tonnes, gps_longitude, gps_latitude))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'STS created successfully'}), 201)

            except sqlite3.Error as e:
                return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        
        return make_response(jsonify({'msg':'Unauthorized access'}), 401)
    
    # Updates an existing STS site
    def put(self, sts_id):
        try:
            info = self.utils.getInfoFromToken(request)

            # @TODO: NEED TO IMPLEMENT DYNAMIC ROLE BASED ACCESS CONTROL
            if info and (info['sub']['role_id'] == 1 or info['sub']['role_id'] == 2):
                data = request.get_json()

                # Check if STS exists
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM sts WHERE sts_id = ?", (sts_id,))
                existing_sts = cursor.fetchone()
                
                if not existing_sts:
                    conn.close()
                    return make_response(jsonify({'error': 'STS not found'}), 404)

                # Check if ward number is being updated
                if 'ward_number' in data:
                    conn.close()
                    return make_response(jsonify({'error': 'Ward number cannot be updated'}), 400)

                # Update STS information
                capacity_tonnes = data.get('capacity_tonnes', existing_sts[2])
                gps_longitude = data.get('gps_longitude', existing_sts[3])
                gps_latitude = data.get('gps_latitude', existing_sts[4])

                cursor.execute("""UPDATE sts SET capacity_tonnes=?, 
                                gps_longitude=?, gps_latitude=? WHERE sts_id=?""",
                                (capacity_tonnes, gps_longitude, gps_latitude, sts_id))
                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'STS updated successfully'}), 200)

            return make_response(jsonify({'msg': 'Unauthorized access'}), 401)

        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)


# @TODO: NEED Erase this class
class UpdateSTS(Resource):
    def put(self, sts_id):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            if info and (info['sub']['role_id'] == 1 or info['sub']['role_id'] == 2):
                data = request.get_json()

                # Check if STS exists
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM sts WHERE sts_id = ?", (sts_id,))
                existing_sts = cursor.fetchone()
                
                if not existing_sts:
                    conn.close()
                    return make_response(jsonify({'error': 'STS not found'}), 404)

                # Check if ward number is being updated
                if 'ward_number' in data:
                    conn.close()
                    return make_response(jsonify({'error': 'Ward number cannot be updated'}), 400)

                # Update STS information
                capacity_tonnes = data.get('capacity_tonnes', existing_sts[2])
                gps_longitude = data.get('gps_longitude', existing_sts[3])
                gps_latitude = data.get('gps_latitude', existing_sts[4])

                cursor.execute("""UPDATE sts SET capacity_tonnes=?, 
                                gps_longitude=?, gps_latitude=? WHERE sts_id=?""",
                                (capacity_tonnes, gps_longitude, gps_latitude, sts_id))
                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'STS updated successfully'}), 200)

            return make_response(jsonify({'msg': 'Unauthorized access'}), 401)

        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)



class GetSTSVehicleList(Resource):
    def get(self):
        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Fetch STS sites data
            cursor.execute("SELECT * FROM sts")
            sts_sites = cursor.fetchall()

            sts_list = []

            for site in sts_sites:
                site_dict = {
                    'sts_id': site[0],
                    'ward_number': site[1],
                    'capacity_tonnes': site[2],
                    'gps_longitude': site[3],
                    'gps_latitude': site[4],
                    'assigned_vehicles': []
                }

                # Fetch vehicles assigned to this STS
                cursor.execute("SELECT * FROM vehicle WHERE sts_id = ?", (site[0],))
                assigned_vehicles = cursor.fetchall()
                for vehicle in assigned_vehicles:
                    vehicle_dict = {
                        'vehicle_id': vehicle[0],
                        'vehicle_reg_number': vehicle[1],
                        'vehicle_type': vehicle[2],
                        'vehicle_capacity_in_ton': vehicle[3],
                        'fuel_cost_per_km_loaded': vehicle[4],
                        'fuel_cost_per_km_unloaded': vehicle[5]
                    }
                    site_dict['assigned_vehicles'].append(vehicle_dict)

                sts_list.append(site_dict)

            conn.close()

            return make_response(jsonify(sts_list), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        



class GetAllSTS(Resource):
    def get(self):
        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Fetch all STS from the database
            cursor.execute("SELECT * FROM sts")
            sts_list = cursor.fetchall()

            conn.close()

            # Format the STS data
            formatted_sts_list = []
            for sts in sts_list:
                sts_dict = {
                    'sts_id': sts[0],
                    'ward_number': sts[1],
                    'capacity_tonnes': sts[2],
                    'gps_longitude': sts[3],
                    'gps_latitude': sts[4]
                }
                formatted_sts_list.append(sts_dict)

            return make_response(jsonify(formatted_sts_list), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)