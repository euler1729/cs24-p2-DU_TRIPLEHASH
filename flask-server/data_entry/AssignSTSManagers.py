import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token

class AssignManager(Resource):
    def post(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            if info and info['sub']['role_id'] == 1:
                data = request.get_json()

                sts_id = data.get('sts_id')
                user_id = data.get('user_id')
                landfill_id = data.get('landfill_id')

                if not any([sts_id, landfill_id]):
                    return make_response(jsonify({'error': 'No STS ID or Landfill ID provided'}), 400)

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                # Verify if the given STS ID exists
                if sts_id:
                    cursor.execute("SELECT sts_id FROM sts WHERE sts_id = ?", (sts_id,))
                    existing_sts = cursor.fetchone()
                    if not existing_sts:
                        return make_response(jsonify({'error': 'STS with the provided ID does not exist'}), 404)

                # Verify if the given Landfill ID exists
                if landfill_id:
                    cursor.execute("SELECT landfill_id FROM landfill_sites WHERE landfill_id = ?", (landfill_id,))
                    existing_landfill = cursor.fetchone()
                    if not existing_landfill:
                        return make_response(jsonify({'error': 'Landfill with the provided ID does not exist'}), 404)

                # Remove previous associations
                cursor.execute("DELETE FROM sts_managers WHERE user_id = ?", (user_id,))
                cursor.execute("DELETE FROM landfill_managers WHERE user_id = ?", (user_id,))

                # Assign the manager to the new site
                if sts_id:
                    role_id = 2
                    cursor.execute("INSERT INTO sts_managers (user_id, sts_id) VALUES (?, ?)", (user_id, sts_id))
                elif landfill_id:
                    role_id = 3
                    cursor.execute("INSERT INTO landfill_managers (user_id, landfill_id) VALUES (?, ?)", (user_id, landfill_id))

                # Change user's role
                cursor.execute("UPDATE user SET role_id = ? WHERE user_id = ?", (role_id, user_id))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Manager assigned and role changed successfully'}), 201)

            return make_response(jsonify({'msg':'Unauthorized access'}), 401)

        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)
