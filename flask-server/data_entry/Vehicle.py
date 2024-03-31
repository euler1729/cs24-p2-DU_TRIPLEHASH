import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token

class AddVehicle(Resource):
    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            # print(info)
            if info and info['sub']['role_id'] == 1:
                data = request.get_json()

                vehicle_reg_number = data.get('vehicle_reg_number')
                vehicle_type = data.get('vehicle_type')
                vehicle_capacity_in_ton = data.get('vehicle_capacity_in_ton')
                fuel_cost_per_km_loaded = data.get('fuel_cost_per_km_loaded')
                fuel_cost_per_km_unloaded = data.get('fuel_cost_per_km_unloaded')
                sts_id = data.get('sts_id')

                if not all([vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton,
                            fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded]):
                    return make_response(jsonify({'error': 'Missing required fields'}), 400)

                try:
                    conn = sqlite3.connect('sqlite.db')
                    cursor = conn.cursor()

                    # Check if vehicle with the same registration number already exists
                    cursor.execute("SELECT * FROM vehicle WHERE vehicle_reg_number = ?", (vehicle_reg_number,))
                    existing_vehicle = cursor.fetchone()
                    if existing_vehicle:
                        return make_response(jsonify({'error': 'Vehicle with the same registration number already exists'}), 400)

                    # Insert new vehicle
                    cursor.execute("""INSERT INTO vehicle 
                                    (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton, 
                                    fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, sts_id)
                                    VALUES (?, ?, ?, ?, ?, ?)""",
                                (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton,
                                    fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, sts_id))

                    conn.commit()
                    conn.close()

                    return make_response(jsonify({'msg': 'Vehicle added successfully'}), 201)

                except sqlite3.Error as e:
                    return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
                
                
            return make_response(jsonify({'msg':'Unauthorized access'}), 401)
        
        except Exception as e:
            return make_response(jsonify({'msg': e}), 401)


class DeleteVehicle(Resource):
    def delete(self, vehicle_id):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            if info and info['sub']['role_id'] == 1:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if vehicle exists
                cursor.execute("SELECT * FROM vehicle WHERE vehicle_id = ?", (vehicle_id,))
                existing_vehicle = cursor.fetchone()
                if not existing_vehicle:
                    conn.close()
                    return make_response(jsonify({'error': 'Vehicle not found'}), 404)

                # Delete vehicle
                cursor.execute("DELETE FROM vehicle WHERE vehicle_id = ?", (vehicle_id,))
                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Vehicle deleted successfully'}), 200)

            return make_response(jsonify({'msg': 'Unauthorized access'}), 401)

        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)


class UpdateVehicle(Resource):
    def put(self, vehicle_id):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            if info and info['sub']['role_id'] == 1:
                data = request.get_json()

                # Check if vehicle exists
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM vehicle WHERE vehicle_id = ?", (vehicle_id,))
                existing_vehicle = cursor.fetchone()
                conn.close()

                if not existing_vehicle:
                    return make_response(jsonify({'error': 'Vehicle not found'}), 404)

                # Update vehicle information
                vehicle_reg_number = data.get('vehicle_reg_number', existing_vehicle[1])
                vehicle_type = data.get('vehicle_type', existing_vehicle[2])
                vehicle_capacity_in_ton = data.get('vehicle_capacity_in_ton', existing_vehicle[3])
                fuel_cost_per_km_loaded = data.get('fuel_cost_per_km_loaded', existing_vehicle[4])
                fuel_cost_per_km_unloaded = data.get('fuel_cost_per_km_unloaded', existing_vehicle[5])
                sts_id = data.get('sts_id', existing_vehicle[6])

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute("""UPDATE vehicle SET vehicle_reg_number=?, vehicle_type=?, 
                                vehicle_capacity_in_ton=?, fuel_cost_per_km_loaded=?, 
                                fuel_cost_per_km_unloaded=?, sts_id=? WHERE vehicle_id=?""",
                                (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton,
                                 fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, sts_id, vehicle_id))
                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Vehicle updated successfully'}), 200)

            return make_response(jsonify({'msg': 'Unauthorized access'}), 401)

        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)



class GetAllVehicles(Resource):
    def get(self):
        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM vehicle")
            vehicles = cursor.fetchall()

            vehicles_list = []

            for vehicle in vehicles:
                vehicle_dict = {
                    'vehicle_id': vehicle[0],
                    'vehicle_reg_number': vehicle[1],
                    'vehicle_type': vehicle[2],
                    'vehicle_capacity_in_ton': vehicle[3],
                    'fuel_cost_per_km_loaded': vehicle[4],
                    'fuel_cost_per_km_unloaded': vehicle[5],
                    'sts_id': vehicle[6]
                }

                vehicles_list.append(vehicle_dict)

            conn.close()

            return make_response(jsonify(vehicles_list), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)