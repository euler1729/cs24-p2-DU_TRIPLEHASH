from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3
from route.Route import Route
from route.FindFleet import optimal_cost, Vehicle



class ActiveTrip(Resource):

    def get(self):
        try:
            token = request.headers.get('Authorization', '').split(' ')[1]
            # Decode the token to retrieve user information
            info = decode_token(token)
            if info:
                role_id = info['sub']['rule_id']
                if role_id == 1:  # Check if user has administrative privileges
                    # Connect to the database
                    conn = sqlite3.connect('sqlite.db')  
                    cursor = conn.cursor()
                    # Query the database to fetch all active trips with full details
                    cursor.execute("SELECT * FROM active_trip JOIN trips ON active_trip.trip_id = trips.trip_id")
                    active_trips = cursor.fetchall()
                    conn.close()
                    # Return the list of active trips with full details in the response
                    return make_response(jsonify({'active_trips': active_trips}), 200)
                else:
                    # For STS managers, retrieve their own active trips based on STS ID
                    data = request.json()
                    sts_id = data.get('sts_id')
                    # Connect to the database
                    conn = sqlite3.connect('sqlite.db') 
                    cursor = conn.cursor()
                    # Query the database to fetch STS manager's own active trips with full details
                    cursor.execute("SELECT * FROM active_trip JOIN trips ON active_trip.trip_id = trips.trip_id WHERE trips.sts_id=?", (sts_id,))
                    sts_manager_active_trips = cursor.fetchall()
                    conn.close()
                    # Return the list of STS manager's own active trips with full details in the response
                    return make_response(jsonify({'sts_manager_active_trips': sts_manager_active_trips}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)    