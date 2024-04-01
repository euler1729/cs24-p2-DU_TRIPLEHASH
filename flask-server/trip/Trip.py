from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3

class Trip(Resource):
    def get(self):
        try:
            token = request.headers.get('Authorization', '').split(' ')[1]
            info = decode_token(token)
            if info:
                role_id = info['sub']['role_id']
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                
                # Extract query parameters
                vehicle_id_filter = request.args.get('vehicle_id')
                start_date = request.args.get('start_date')
                end_date = request.args.get('end_date')
                filter = request.args.get('filter')

                
                params = []
                # Add conditions based on the provided parameters
                query = 'select * from trips join active_trip on trips.trip_id = active_trip.trip_id;'
                conditions = []
                if vehicle_id_filter:
                    conditions.append("trips.vehicle_id = ?")
                    params.append(vehicle_id_filter)
                if start_date and end_date:
                    conditions.append("trips.start_time BETWEEN ? AND ?")
                    params.extend([start_date, end_date])
                
                # Construct the final query
                if conditions:
                    query += " WHERE " + " AND ".join(conditions)
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute(query, params)
                trips = cursor.fetchall()

                formatted_trips = []
                for trip in trips:
                    t = {
                        "trip_id": trip[0],
                        "vehicle_id": trip[1],
                        "sts_id": trip[2],
                        "landfill_id": trip[3],
                        "start_time": trip[4],
                        "dump_time": trip[5],
                        "end_time": trip[6],
                        "cost": trip[7],
                        "fuel": trip[8],
                        "load": trip[9],
                        "status": "Active",
                    }
                    formatted_trips.append(t)
                
                query = "SELECT trips.*, active_trip.* FROM trips LEFT JOIN active_trip ON trips.trip_id = active_trip.trip_id WHERE active_trip.trip_id IS NULL;"


                cursor.execute(query, params)
                trips = cursor.fetchall()
                formatted_trips2 = []
                for trip in trips:
                    t = {
                        "trip_id": trip[0],
                        "vehicle_id": trip[1],
                        "sts_id": trip[2],
                        "landfill_id": trip[3],
                        "start_time": trip[4],
                        "dump_time": trip[5],
                        "end_time": trip[6],
                        "cost": trip[7],
                        "fuel": trip[8],
                        "load": trip[9],
                        "status": "Inactive",
                    }
                    formatted_trips2.append(t)
                if filter == 'Active':
                    response = formatted_trips
                elif filter == 'Completed':
                    response = formatted_trips2
                else:
                    response = formatted_trips + formatted_trips2
                    response = sorted(response, key=lambda x: x['start_time'], reverse=True)

                
                return make_response(jsonify({'trips': response}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': str(e)}), 500)
