import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
        


class AssignSTSManagers(Resource):
    def post(self):
        data = request.get_json()

        sts_id = data.get('sts_id')
        manager_ids = data.get('manager_ids')

        if not all([sts_id, manager_ids]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Check if STS exists
            cursor.execute("SELECT * FROM sts WHERE sts_id=?", (sts_id,))
            sts = cursor.fetchone()
            if not sts:
                return make_response(jsonify({'error': 'STS not found'}), 404)

            # Assign each manager to the STS
            for manager_id in manager_ids:
                cursor.execute("""INSERT INTO sts_managers 
                                  (user_id, sts_id)
                                  VALUES (?, ?)""",
                               (manager_id, sts_id))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'STS managers assigned successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
  