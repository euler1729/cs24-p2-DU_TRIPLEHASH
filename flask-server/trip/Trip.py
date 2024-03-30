from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3
from route.Route import Route
from route.FindFleet import optimal_cost, Vehicle

class Trip(Resource):

    def get(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                role_id = info['sub']['rule_id']
                if role_id == 1:
                    conn = sqlite3.connect('your_database.db')  # replace with your database name
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM trips")
                    trips = cursor.fetchall()
                    conn.close()
                    return make_response(jsonify({'trips': trips}), 200)
                else:
                    return make_response(jsonify({'msg': 'Unauthorized access.'}), 403)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
        
    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
            
                # if role_id != 1:
                #     return make_response(jsonify({'msg': 'Unauthorized access.'}), 403)
                
                # Parse JSON data from the request body
                data = request.get_json()
                vehicle_id = data.get('vehicle_id')
                sts_id = data.get('sts_id')
                landfill_id = data.get('landfill_id')
                start_time = data.get('start_time')
                dump_time = data.get('dump_time')
                end_time = data.get('end_time')
                load = data.get('load')
                cost = data.get('cost')
                fuel = data.get('fuel')

                # Validate the required fields
                if not (vehicle_id and sts_id and landfill_id and start_time and dump_time and end_time and cost and fuel):
                    return make_response(jsonify({'msg': 'Missing required fields.'}), 400)

                # Connect to the database
                conn = sqlite3.connect('sqlite.db')  
                cursor = conn.cursor()

                # Insert the trip information into the trips table
                cursor.execute("INSERT INTO trips (vehicle_id, sts_id, landfill_id, start_time, dump_time, end_time, cost, fuel, load) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            (vehicle_id, sts_id, landfill_id, start_time, dump_time, end_time, cost, fuel, load))

                # Get the trip_id of the newly inserted trip
                trip_id = cursor.lastrowid

                # Insert the trip information into the active_trip table
                cursor.execute("INSERT INTO active_trip (trip_id, vehicle_id, to_landfill) VALUES (?, ?, ?)", (trip_id, vehicle_id, landfill_id))

                # Commit the transaction and close the connection
                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Trip created successfully.'}), 201)

        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)
