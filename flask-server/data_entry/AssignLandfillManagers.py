import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token     


# Can assign one or more managers to a landfill site
class AssignLandfillManagers(Resource):
    def post(self):
        token = request.headers['Authorization'].split(' ')[1]
        info = decode_token(token)

        # print(info)
        if info and info['sub']['role_id'] == 1:
            data = request.get_json()

            landfill_id = data.get('landfill_id')
            manager_ids = data.get('manager_ids')

            if not all([landfill_id, manager_ids]):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)

            try:
                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Check if landfill site exists
                cursor.execute("SELECT * FROM landfill_sites WHERE landfill_id=?", (landfill_id,))
                landfill_site = cursor.fetchone()
                if not landfill_site:
                    return make_response(jsonify({'error': 'Landfill site not found'}), 404)

                # Assign each manager to the landfill site
                for manager_id in manager_ids:
                    cursor.execute("""INSERT INTO landfill_managers 
                                    (manager_id, landfill_id)
                                    VALUES (?, ?)""",
                                (manager_id, landfill_id))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Landfill managers assigned successfully'}), 200)

            except sqlite3.Error as e:
                return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        
        return make_response(jsonify({'msg':'Unauthorized access'}), 401)