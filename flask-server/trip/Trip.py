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
                
                # Initialize base query and parameters
                query = """
                    SELECT 
                        trips.trip_id, 
                        trips.vehicle_id, 
                        trips.sts_id, 
                        trips.landfill_id, 
                        trips.start_time, 
                        trips.dump_time, 
                        trips.end_time, 
                        trips.cost, 
                        trips.fuel, 
                        trips.load,
                        CASE
                            WHEN active_trip.trip_id IS NULL THEN 'Completed'
                            WHEN trips.end_time IS NULL THEN 'Active'
                            ELSE 'To Landfill'
                        END AS status
                    FROM 
                        trips 
                    LEFT JOIN 
                        active_trip 
                    ON 
                        trips.trip_id = active_trip.trip_id
                """
                params = []
                
                # Add conditions based on the provided parameters
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
                
                # Debugging: Print the query and parameters
                # print("Query:", query)
                # print("Params:", params)
                
                # Execute the query
                cursor.execute(query, params)
                trips = cursor.fetchall()
                conn.close()
                
                # Format the result
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
                        "status": trip[10]
                    }
                    formatted_trips.append(t)
                return make_response(jsonify({'trips': formatted_trips}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': str(e)}), 500)
