import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token       

class AssignSTSVehicles(Resource):
    def put(self):
        token = request.headers['Authorization'].split(' ')[1]
        info = decode_token(token)

        print(info)
        if info and info['sub']['role_id'] == 1:
            data = request.get_json()

            sts_id = data.get('sts_id')
            vehicle_id = data.get('vehicle_id')

            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if STS exists
                cursor.execute("SELECT * FROM sts WHERE sts_id=?", (sts_id,))
                sts = cursor.fetchone()
                if not sts and sts_id != 0:
                    return make_response(jsonify({'error': 'STS not found'}), 404)

                if sts_id == 0:
                    # Unassign the vehicle from its STS
                    cursor.execute("UPDATE vehicle SET sts_id=NULL WHERE vehicle_id=?", (vehicle_id,))
                else:
                    # Check if vehicle exists and is not assigned to another STS
                    cursor.execute("SELECT * FROM vehicle WHERE vehicle_id=? AND (sts_id IS NULL OR sts_id=?)", (vehicle_id, sts_id))
                    vehicle = cursor.fetchone()
                    if not vehicle:
                        return make_response(jsonify({'error': 'Vehicle not found or already assigned to another STS'}), 404)

                    # Update STS ID for the vehicle
                    cursor.execute("UPDATE vehicle SET sts_id=? WHERE vehicle_id=?", (sts_id, vehicle_id))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Vehicles assigned to STS successfully'}), 201)

            except sqlite3.Error as e:
                return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        
        return make_response(jsonify({'msg':'Unauthorized access'}), 401)
