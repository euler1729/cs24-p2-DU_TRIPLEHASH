from flask import Flask, jsonify, make_response
from flask_restful import Resource
import sqlite3


def fetch_all_data():
    try:
        conn = sqlite3.connect('sqlite.db')
        cursor = conn.cursor()

        # Fetch users data
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

        # Fetch vehicles data
        cursor.execute("SELECT * FROM vehicle")
        vehicles = cursor.fetchall()

        vehicles_list = []

        for vehicle in vehicles:
            vehicle_dict = {
                'vehicle_id': vehicle[0],
                'vehicle_reg_number': vehicle[1],
                'vehicle_type': vehicle[2],
                'vehicle_capacity_in_ton': vehicle[3],
                'fuel_cost_per_km_loaded': vehicle[4],
                'fuel_cost_per_km_unloaded': vehicle[5],
                'sts_id': vehicle[6]
            }

            vehicles_list.append(vehicle_dict)

        # Fetch STS sites data
        cursor.execute("SELECT * FROM sts")
        sts_sites = cursor.fetchall()

        sts_list = []

        for site in sts_sites:
            site_dict = {
                'sts_id': site[0],
                'ward_number': site[1],
                'capacity_tonnes': site[2],
                'gps_longitude': site[3],
                'gps_latitude': site[4]
            }

            sts_list.append(site_dict)

        # Fetch landfill sites data
        cursor.execute("SELECT * FROM landfill_sites")
        landfill_sites = cursor.fetchall()

        landfill_sites_list = []

        for site in landfill_sites:
            site_dict = {
                'landfill_id': site[0],
                'site_name': site[1],
                'capacity': site[2],
                'operational_timespan': site[3],
                'gps_longitude': site[4],
                'gps_latitude': site[5]
            }

            landfill_sites_list.append(site_dict)

        all_data = {
            'users': users_list,
            'vehicles': vehicles_list,
            'sts_sites': sts_list,
            'landfill_sites': landfill_sites_list
        }

        conn.close()

        return all_data

    except sqlite3.Error as e:
        return {'error': 'Database error', 'details': str(e)}


class GetAllData(Resource):
    def get(self):
        all_data = fetch_all_data()
        if 'error' in all_data:
            return make_response(jsonify(all_data), 500)
        return make_response(jsonify(all_data), 200)
