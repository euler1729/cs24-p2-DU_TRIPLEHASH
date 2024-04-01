from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3
from route.Route import Route
from route.FindFleet import optimal_cost, Vehicle



class ActiveTrip(Resource):

    def get(self):
        from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3

class ActiveTrip(Resource):

    def get(self):
        try:
            token = request.headers.get('Authorization', '').split(' ')[1]
            info = decode_token(token)
            if info:
                role_id = info['sub']['role_id']
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                print(request.get_json())
                # Extract query 
                data = request.get_json()
                vehicle_id_filter = request.args.get('vehicle_id')
                start_date = request.args.get('start_date')
                end_date = request.args.get('end_date')
                sts_id = request.args.get('sts_id')

                # Initialize query and parameters
                query = "SELECT * FROM active_trip JOIN trips ON active_trip.trip_id = trips.trip_id"
                params = []

                # Check role and construct the query accordingly
                if role_id != 1:  # Admin can see all trips
                    if sts_id is None:
                        return make_response(jsonify({'msg': 'STS ID not found in request.'}), 500)
                    query += " WHERE trips.sts_id=?"
                    params.append(sts_id)
                
                # Append filters to the query if provided
                if vehicle_id_filter:
                    query += " AND trips.vehicle_id=?"
                    params.append(vehicle_id_filter)
                if start_date and end_date:
                    query += " AND trips.start_time BETWEEN ? AND ?"
                    params.extend([start_date, end_date])

                # Execute the query
                cursor.execute(query, params)
                active_trips = cursor.fetchall()
                conn.close()
                print(params)
                # Format the result
                trips = []
                for trip in active_trips:
                    t = {
                        "trip_id": trip[0],
                        "vehicle_id": trip[1],
                        "sts_id": trip[3],
                        "direction": trip[2],  
                        "start_time": trip[4],
                        "landfill_id": trip[6], 
                        "dump_time": trip[8],
                        "end_time": trip[9],
                        "cost": trip[10],
                        "fuel": trip[11],
                        "load": trip[12],
                    }
                    trips.append(t)

                return make_response(jsonify({'active_trips': trips}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': str(e)}), 500)
