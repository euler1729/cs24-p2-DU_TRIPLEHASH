import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token


class AddSTSVehicleEntry(Resource):
    def post(self):
        token = request.headers['Authorization'].split(' ')[1]
        info = decode_token(token)

        # print(info)
        if info and info['sub']['role_id'] == 2:
            data = request.get_json()

            sts_id = data.get('sts_id')
            vehicle_number = data.get('vehicle_number')
            weight_of_waste = data.get('weight_of_waste')
            time_of_arrival = data.get('time_of_arrival')
            time_of_departure = data.get('time_of_departure')

            if not all([sts_id, vehicle_number, weight_of_waste, time_of_arrival, time_of_departure]):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)

            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if STS exists
                cursor.execute("SELECT * FROM sts WHERE sts_id=?", (sts_id,))
                sts = cursor.fetchone()
                if not sts:
                    return make_response(jsonify({'error': 'STS not found'}), 404)

                # Check if vehicle belongs to the STS
                cursor.execute("SELECT * FROM vehicle WHERE sts_id=? AND vehicle_reg_number=?", (sts_id, vehicle_number))
                vehicle = cursor.fetchone()
                if not vehicle:
                    return make_response(jsonify({'error': 'Vehicle not found or does not belong to the STS'}), 404)

                # Insert vehicle entry
                cursor.execute("""INSERT INTO vehicle_entries 
                                (sts_id, vehicle_number, weight_of_waste, time_of_arrival, time_of_departure)
                                VALUES (?, ?, ?, ?, ?)""",
                            (sts_id, vehicle_number, weight_of_waste, time_of_arrival, time_of_departure))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Vehicle entry added successfully'}), 200)

            except sqlite3.Error as e:
                return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        
        return make_response(jsonify({'msg':'Unauthorized access'}), 401)