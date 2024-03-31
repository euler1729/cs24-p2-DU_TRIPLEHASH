from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3
from route.Route import Route
from route.FindFleet import optimal_cost, Vehicle

class Trip(Resource):

    def get(self):
        try:
            token = request.headers.get('Authorization', '').split(' ')[1]
            info = decode_token(token)
            data = request.get_json()
            if info:
                role_id = info['sub']['role_id']
                conn = sqlite3.connect('sqlite.db')  
                cursor = conn.cursor()
                params = []
                query = "SELECT * FROM trips WHERE 1=1"  # Starting query
                if 'date1' and 'date2' in data:
                    date1 = data.get('date1')
                    date2 = data.get('date2')
                    query += " AND start_time BETWEEN ? AND ?"
                    params.extend((date1, date2))
                if 'vehicle_id' in data:
                    vehicle_id = data.get('vehicle_id')
                    query += " AND vehicle_id = ?"
                    params.append(vehicle_id)
                if role_id == 2:
                    sts_id = data.get('sts_id')
                    if sts_id is None:
                        return make_response(jsonify({'msg': 'STS ID is required for STS managers.'}), 400)
                    print(sts_id, 'sts_id')
                    query += " AND sts_id = ?"
                    params.append(sts_id)
                cursor.execute(query, params)
                trips = cursor.fetchall()
                res = []
                for t in trips:
                    trip_data = {
                        "trip_id": t[0],
                        "vehicle_id": t[1],
                        "sts_id": t[2],
                        "landfill_id": t[3],
                        "start_time": t[4],
                        "dump_time": t[5],
                        "end_time": t[6],
                        "cost": t[7],
                        "fuel": t[8],
                        "load": t[9],
                    }
                    res.append(trip_data)
                print(params)
                conn.close()
                return make_response(jsonify({'trips': res}), 200)
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
