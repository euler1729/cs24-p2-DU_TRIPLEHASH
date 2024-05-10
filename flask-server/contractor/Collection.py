from flask_restful import Resource
from flask import request, jsonify, make_response
from database import Database
from utils import Utils

class Collection(Resource):

    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def get(self, collection_id=None):
        try:
            print(request.headers)
            info = self.utils.getInfoFromToken(request)
            if info:
                if collection_id:
                    self.database.execute('SELECT * FROM collection WHERE collection_id = ?', (collection_id,))
                    c = self.database.fetchone()
                    if c:
                        collection = {
                            "collection_id": c[0],
                            "start_time": c[1],
                            "duration": c[2],
                            "no_labour": c[3],
                            "no_vans": c[4],
                            "exp_wt": c[5],
                            "area" : c[6]
                        }
                        return make_response(jsonify({"collection": collection}), 200)
                    else:
                        return make_response(jsonify({"msg": "Collection not found"}), 404)
                print('here')
                self.database.execute('SELECT * FROM collection')
                collections = self.database.fetchall()
                res = []
                for c in collections:
                    collection = {
                        "collection_id": c[0],
                        "start_time": c[1],
                        "duration": c[2],
                        "no_labour": c[3],
                        "no_vans": c[4],
                        "exp_wt": c[5],
                        "area": c[6],
                    }
                    res.append(collection)
                return make_response(jsonify({"collection": res}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def post(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                print(data)
                self.database.execute(
                    'INSERT INTO collection (start_time, duration, no_labour, no_vans, exp_wt, area) VALUES (?, ?, ?, ?, ?, ?)',
                    (
    
                        data['start_time'],
                        data['duration'],
                        data['no_labour'],
                        data['no_vans'],
                        data['exp_wt'],
                        data['area']
                    )
                )
                self.database.commit()
                return make_response(jsonify({"msg": "Collection added successfully"}), 200)
        except Exception as e:
            self.database.rollback()
            return make_response(jsonify({'msg': str(e)}), 400)

    def put(self, collection_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                self.database.execute(
                    'UPDATE collection SET start_time = ?, duration = ?, no_labour = ?, no_vans = ?, exp_wt = ? WHERE collection_id = ?',
                    (
                        data['start_time'],
                        data['duration'],
                        data['no_labour'],
                        data['no_vans'],
                        data['exp_wt'],
                        collection_id
                    )
                )
                self.database.commit()
                return make_response(jsonify({"msg": "Collection updated successfully"}), 200)
        except Exception as e:
            self.database.rollback()
            return make_response(jsonify({'msg': str(e)}), 400)

    def delete(self, collection_id=None):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                self.database.execute('SELECT * FROM collection WHERE collection_id = ?', (collection_id,))
                collection = self.database.fetchone()
                
                if not collection:
                    return make_response(jsonify({"msg": "Collection not found"}), 404)
                
                self.database.execute('DELETE FROM collection WHERE collection_id = ?', (collection_id,))
                self.database.commit()
                return make_response(jsonify({"msg": "Collection deleted successfully"}), 200)
        except Exception as e:
            self.database.rollback()
            return make_response(jsonify({'msg': str(e)}), 400)
