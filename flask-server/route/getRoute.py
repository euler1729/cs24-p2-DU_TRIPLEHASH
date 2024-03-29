from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from route.Route import Route

class GetRoute(Resource):

    def get(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)
            if info:
                data = request.get_json()
                route = Route()
                route = route.getRoute(data['origin'], data['destination'])
                if route:
                    return make_response(jsonify({'route': route}), 200)
                else:
                    return make_response(jsonify({'msg': 'No Route Found!'}), 404)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    

