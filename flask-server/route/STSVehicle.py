from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3

class STSVehicle(Resource):
    def get(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                sts_id = request.args.get('sts_id')
                vehicle_type = request.args.get('type')
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                query = 'SELECT * FROM vehicle WHERE sts_id = ? AND vehicle_type = ?'
                cursor.execute(query, (sts_id, vehicle_type))
                vehicles = cursor.fetchall()
                formatted_vehicles = []
                for vehicle in vehicles:
                    v = {
                        "reg": vehicle[1],
                        "capacity": vehicle[3],
                        "unloaded_cost": vehicle[4],
                        "loaded_cost": vehicle[5],
                    }
                    formatted_vehicles.append(v)
                print(formatted_vehicles)
                make_response(jsonify({'vehicles': formatted_vehicles}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'msg': str(e)}), 500)
