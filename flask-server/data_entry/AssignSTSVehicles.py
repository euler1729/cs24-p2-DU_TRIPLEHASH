import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token       
        


class AssignSTSVehicles(Resource):
    def post(self):
        token = request.headers['Authorization'].split(' ')[1]
        info = decode_token(token)

        # print(info)
        if info and info['sub']['role_id'] == 2:
            data = request.get_json()

            sts_id = data.get('sts_id')
            vehicle_ids = data.get('vehicle_ids')

            if not all([sts_id, vehicle_ids]):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)

            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if STS exists
                cursor.execute("SELECT * FROM sts WHERE sts_id=?", (sts_id,))
                sts = cursor.fetchone()
                if not sts:
                    return make_response(jsonify({'error': 'STS not found'}), 404)

                # Assign each vehicle to the STS
                for vehicle_id in vehicle_ids:
                    # Check if vehicle exists and is not assigned to another STS
                    cursor.execute("SELECT * FROM vehicle WHERE vehicle_id=? AND sts_id IS NULL", (vehicle_id,))
                    vehicle = cursor.fetchone()
                    if not vehicle:
                        return make_response(jsonify({'error': 'Vehicle not found or already assigned to an STS'}), 404)

                    # Update STS ID for the vehicle
                    cursor.execute("UPDATE vehicle SET sts_id=? WHERE vehicle_id=?", (sts_id, vehicle_id))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Vehicles assigned to STS successfully'}), 201)

            except sqlite3.Error as e:
                return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        
        return make_response(jsonify({'msg':'Unauthorized access'}), 401)