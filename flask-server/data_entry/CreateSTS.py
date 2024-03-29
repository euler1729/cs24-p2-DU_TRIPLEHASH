import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
        


# For STS
class CreateSTS(Resource):
    def post(self):
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

            # Insert STS data
            cursor.execute("""INSERT INTO sts 
                              (ward_number, capacity_tonnes, gps_longitude, gps_latitude)
                              VALUES (?, ?, ?, ?)""",
                           (ward_number, capacity_tonnes, gps_longitude, gps_latitude))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'STS created successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        
