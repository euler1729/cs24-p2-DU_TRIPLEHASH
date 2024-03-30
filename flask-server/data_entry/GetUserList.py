from flask import Flask, jsonify, make_response
from flask_restful import Resource
import sqlite3


class GetAllUsers(Resource):
    def get(self):
        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Exclude admins
            cursor.execute("SELECT * FROM user WHERE role_id != 1")
            users = cursor.fetchall()

            users_list = []

            for user in users:
                user_id = user[0]
                user_name = user[1]
                email = user[2]
                role_id = user[4]
                name = user[5]
                age = user[6]
                phone_number = user[7]

                # Fetch role name from role table
                cursor.execute("SELECT role_name FROM role WHERE role_id = ?", (role_id,))
                role_name = cursor.fetchone()[0]

                sites_managed_by_user = []

                # Check roles
                if role_id == 2:  # STS Manager
                    cursor.execute("SELECT sts_id FROM sts_managers WHERE user_id = ?", (user_id,))
                    sts_ids = cursor.fetchall()
                    for sts_id in sts_ids:
                        sites_managed_by_user.append({'sts_id': sts_id[0]})

                elif role_id == 3:  # Landfill Manager
                    cursor.execute("SELECT landfill_id FROM landfill_managers WHERE user_id = ?", (user_id,))
                    landfill_ids = cursor.fetchall()
                    for landfill_id in landfill_ids:
                        sites_managed_by_user.append({'landfill_id': landfill_id[0]})

                user_dict = {
                    'user_id': user_id,
                    'user_name': user_name,
                    'email': email,
                    'role_id': role_id,
                    'role_name': role_name,
                    'name': name,
                    'age': age,
                    'phone_number': phone_number,
                    'sites_managed_by_user': sites_managed_by_user
                }

                users_list.append(user_dict)

            conn.close()

            return make_response(jsonify(users_list), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)