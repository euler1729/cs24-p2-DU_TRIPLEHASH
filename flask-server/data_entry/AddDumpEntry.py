import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token


class AddDumpEntry(Resource):
    def post(self):
        token = request.headers['Authorization'].split(' ')[1]
        info = decode_token(token)

        # print(info)
        if info and info['sub']['role_id'] == 3:

            data = request.get_json()

            # print(data)

            landfill_id = data.get('landfill_id')
            vehicle_id = data.get('vehicle_id')
            weight_of_waste = data.get('weight_of_waste')
            time_of_arrival = data.get('time_of_arrival')
            time_of_departure = data.get('time_of_departure')

            # print(landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure)

            if not all([landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure]):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)

            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if landfill site exists
                cursor.execute("SELECT * FROM landfill_sites WHERE landfill_id=?", (landfill_id,))
                landfill_site = cursor.fetchone()
                if not landfill_site:
                    return make_response(jsonify({'error': 'Landfill site not found'}), 404)


                # Check if adding this dump entry will exceed the capacity of the landfill site
                cursor.execute("SELECT SUM(weight_of_waste) FROM dump_entries WHERE landfill_id=?", (landfill_id,))
                total_waste = cursor.fetchone()[0] or 0
                if total_waste + weight_of_waste > landfill_site[2]:  # landfill_site[2] = capacity
                    return make_response(jsonify({'error': 'Adding this dump entry will exceed the capacity of the landfill site'}), 400)

                # Insert dump entry
                cursor.execute("""INSERT INTO dump_entries 
                                (landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure)
                                VALUES (?, ?, ?, ?, ?)""",
                            (landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Dump entry added successfully'}), 200)

            except sqlite3.Error as e:
                return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
            
        return make_response(jsonify({'msg':'Unauthorized access'}), 401)