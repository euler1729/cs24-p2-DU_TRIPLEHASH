from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3
from route.Route import Route
from route.FindFleet import optimal_cost, Vehicle
from datetime import datetime

class MakeTrip(Resource):
    
    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            print(info)
            if info:
                data = request.get_json()
                sts_id = data.get('sts_id')
                vehicle_id = data.get('vehicle_id')
                load = data.get('load')
                start_time = datetime.now()
                cost = data.get('cost')

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute('INSERT INTO trips (vehicle_id, sts_id, start_time, load, cost) VALUES (?, ?, ?, ?, ?)', (vehicle_id, sts_id, start_time, load, cost))
                conn.commit()
                cursor.execute('INSERT INTO active_trip (vehicle_id, to_landfill) VALUES (?, ?)', (vehicle_id, 1))
                conn.commit()
                conn.close()
                return make_response(jsonify({'msg': 'Trip created successfully'}), 201)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': str(e)}), 401)



                

                
