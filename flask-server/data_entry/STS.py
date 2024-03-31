import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token


# For STS
class CreateSTS(Resource):
    def post(self):
        token = request.headers['Authorization'].split(' ')[1]
        info = decode_token(token)

        # print(info)
        if info and info['sub']['role_id'] == 2:
            
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
        
