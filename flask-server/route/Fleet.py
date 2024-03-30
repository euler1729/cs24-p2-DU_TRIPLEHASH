from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
import sqlite3
from route.Route import Route
from route.FindFleet import optimal_cost, Vehicle


class Fleet(Resource):

    def get(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                data = request.get_json()
                sts_id = data.get('sts_id')
                landfil_id = data.get('landfill_id')
                total_waste = data.get('total_waste')
                if sts_id is None:
                    return make_response(jsonify({'msg': 'No sts_id.'}))
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()
                cursor.execute(
                    'SELECT * from vehicle where sts_id = ?', (sts_id,))
                vehicles = cursor.fetchall()
                vehi = []
                for v in vehicles:
                    vehi.append(
                        Vehicle(id=v[0], capacity=v[3], loaded_cost=v[4], unloaded_cost=v[5]))
                cursor.execute(
                    "SELECT gps_longitude, gps_latitude from sts where sts_id = ?", (sts_id,))
                sts_loc = cursor.fetchone()
                cursor.execute(
                    "SELECT gps_longitude, gps_latitude from landfill_sites where landfill_id = ?", (sts_id,))
                landfil_loc = cursor.fetchone()

                route = Route()
                # dist = route.getDistance(origin=f"{sts_loc[0]} {sts_loc[1]}", destination=f"{landfil_loc[0]} {landfil_loc[1]}")
                dist = route.getDistance(
                    origin="23.7338578, 90.392926", destination="23.8028448, 90.3748457")
                print(dist)
                cost = optimal_cost(
                    vehicles=vehi, total_waste=total_waste, dist=dist)
                total_cost, trips = cost.findOptimal()
                print(total_cost)
                return make_response(jsonify({"trips": trips}), 200)

        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)
