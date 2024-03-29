import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
        


class CreateLandfillSite(Resource):
    def post(self):
        data = request.get_json()

        site_name = data.get('site_name')
        capacity = data.get('capacity')
        operational_timespan = data.get('operational_timespan')
        gps_longitude = data.get('gps_longitude')
        gps_latitude = data.get('gps_latitude')

        if not all([site_name, capacity, operational_timespan, gps_longitude, gps_latitude]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Insert landfill site data
            cursor.execute("""INSERT INTO landfill_sites 
                              (site_name, capacity, operational_timespan, gps_longitude, gps_latitude)
                              VALUES (?, ?, ?, ?, ?)""",
                           (site_name, capacity, operational_timespan, gps_longitude, gps_latitude))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Landfill site created successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)