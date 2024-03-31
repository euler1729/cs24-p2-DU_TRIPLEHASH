import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response
from TokenManager import decode_token

class AssignManager(Resource):
    def put(self):
        try:
            token = request.headers['Authorization'].split(' ')[1]
            info = decode_token(token)

            if info and info['sub']['role_id'] == 1:
                data = request.get_json()

                role_id = data.get('role_id')
                user_id = data.get('user_id')
                assigned_to = data.get('assigned_to')

                conn = sqlite3.connect('sqlite.db')
                cursor = conn.cursor()

                if role_id == 4:
                    # Remove existing manager associations
                    cursor.execute("DELETE FROM sts_managers WHERE user_id = ?", (user_id,))
                    cursor.execute("DELETE FROM landfill_managers WHERE user_id = ?", (user_id,))
                
                
                elif role_id == 3:
                    # Check if landfill exists
                    cursor.execute("SELECT landfill_id FROM landfill_sites WHERE landfill_id = ?", (assigned_to,))
                    landfill = cursor.fetchone()
                    if not landfill:
                        return make_response(jsonify({'error': 'Landfill with the provided ID does not exist'}), 404)
                    
                    # Remove from STS and landfill
                    cursor.execute("DELETE FROM sts_managers WHERE user_id = ?", (user_id,))
                    cursor.execute("DELETE FROM landfill_managers WHERE user_id = ?", (user_id,))
                    
                    # Assign user as manager of landfill
                    cursor.execute("INSERT INTO landfill_managers (user_id, landfill_id) VALUES (?, ?)", (user_id, assigned_to))
                
                
                elif role_id == 2:
                    # Check if sts exists
                    cursor.execute("SELECT sts_id FROM sts WHERE sts_id = ?", (assigned_to,))
                    sts = cursor.fetchone()
                    if not sts:
                        return make_response(jsonify({'error': 'STS with the provided ID does not exist'}), 404)
                    

                    # Remove from landfill and sts
                    cursor.execute("DELETE FROM landfill_managers WHERE user_id = ?", (user_id,))
                    cursor.execute("DELETE FROM sts_managers WHERE user_id = ?", (user_id,))


                    # Assign user as manager of STS
                    cursor.execute("INSERT INTO sts_managers (user_id, sts_id) VALUES (?, ?)", (user_id, assigned_to))
                else:
                    return make_response(jsonify({'error': 'Invalid role_id'}), 400)

                # Change user's role
                cursor.execute("UPDATE user SET role_id = ? WHERE user_id = ?", (role_id, user_id))

                conn.commit()
                conn.close()

                return make_response(jsonify({'msg': 'Manager assigned and role changed successfully'}), 201)

            return make_response(jsonify({'msg':'Unauthorized access'}), 401)

        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)
