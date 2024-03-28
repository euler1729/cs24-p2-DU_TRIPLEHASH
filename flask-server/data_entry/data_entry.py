import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response

class Vehicle(Resource):
    def post(self):

        data = request.get_json()

        # print("here's data", data)

        vehicle_reg_number = data.get('vehicle_reg_number')
        vehicle_type = data.get('vehicle_type')
        vehicle_capacity_in_ton = data.get('vehicle_capacity_in_ton')
        fuel_cost_per_km_loaded = data.get('fuel_cost_per_km_loaded')
        fuel_cost_per_km_unloaded = data.get('fuel_cost_per_km_unloaded')

        # Check if every field is found
        if not all([vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton, 
                    fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Insert data 
            cursor.execute("""INSERT INTO vehicle 
                              (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton, 
                              fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded)
                              VALUES (?, ?, ?, ?, ?)""",
                           (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton,
                            fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Vehicle added successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)