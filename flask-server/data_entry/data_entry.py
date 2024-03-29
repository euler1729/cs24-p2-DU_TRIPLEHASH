import sqlite3
from flask_restful import Resource
from flask import jsonify, request, make_response

class AddVehicle(Resource):
    def post(self):

        data = request.get_json()

        # print("here's data", data)

        vehicle_reg_number = data.get('vehicle_reg_number')
        vehicle_type = data.get('vehicle_type')
        vehicle_capacity_in_ton = data.get('vehicle_capacity_in_ton')
        fuel_cost_per_km_loaded = data.get('fuel_cost_per_km_loaded')
        fuel_cost_per_km_unloaded = data.get('fuel_cost_per_km_unloaded')
        sts_id = data.get('sts_id')  

        if not all([vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton, 
                    fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            cursor.execute("""INSERT INTO vehicle 
                              (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton, 
                              fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, sts_id)
                              VALUES (?, ?, ?, ?, ?, ?)""",
                           (vehicle_reg_number, vehicle_type, vehicle_capacity_in_ton,
                            fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, sts_id))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Vehicle added successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        





# For STS
class CreateSTS(Resource):
    def post(self):
        data = request.get_json()

        ward_number = data.get('ward_number')
        capacity_tonnes = data.get('capacity_tonnes')
        gps_longitude = data.get('gps_longitude')
        gps_latitude = data.get('gps_latitude')

        if not all([ward_number, capacity_tonnes, gps_longitude, gps_latitude]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Insert STS data
            cursor.execute("""INSERT INTO sts 
                              (ward_number, capacity_tonnes, gps_longitude, gps_latitude)
                              VALUES (?, ?, ?, ?)""",
                           (ward_number, capacity_tonnes, gps_longitude, gps_latitude))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'STS created successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        




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
        


class AssignSTSVehicles(Resource):
    def post(self):
        data = request.get_json()

        sts_id = data.get('sts_id')
        vehicle_ids = data.get('vehicle_ids')

        if not all([sts_id, vehicle_ids]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Check if STS exists
            cursor.execute("SELECT * FROM sts WHERE sts_id=?", (sts_id,))
            sts = cursor.fetchone()
            if not sts:
                return make_response(jsonify({'error': 'STS not found'}), 404)

            # Assign each vehicle to the STS
            for vehicle_id in vehicle_ids:
                # Check if vehicle exists and is not assigned to another STS
                cursor.execute("SELECT * FROM vehicle WHERE vehicle_id=? AND sts_id IS NULL", (vehicle_id,))
                vehicle = cursor.fetchone()
                if not vehicle:
                    return make_response(jsonify({'error': 'Vehicle not found or already assigned to an STS'}), 404)

                # Update STS ID for the vehicle
                cursor.execute("UPDATE vehicle SET sts_id=? WHERE vehicle_id=?", (sts_id, vehicle_id))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Vehicles assigned to STS successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        




class AddSTSVehicleEntry(Resource):
    def post(self):
        data = request.get_json()

        sts_id = data.get('sts_id')
        vehicle_number = data.get('vehicle_number')
        weight_of_waste = data.get('weight_of_waste')
        time_of_arrival = data.get('time_of_arrival')
        time_of_departure = data.get('time_of_departure')

        if not all([sts_id, vehicle_number, weight_of_waste, time_of_arrival, time_of_departure]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Check if STS exists
            cursor.execute("SELECT * FROM sts WHERE sts_id=?", (sts_id,))
            sts = cursor.fetchone()
            if not sts:
                return make_response(jsonify({'error': 'STS not found'}), 404)

            # Check if vehicle belongs to the STS
            cursor.execute("SELECT * FROM vehicle WHERE sts_id=? AND vehicle_reg_number=?", (sts_id, vehicle_number))
            vehicle = cursor.fetchone()
            if not vehicle:
                return make_response(jsonify({'error': 'Vehicle not found or does not belong to the STS'}), 404)

            # Insert vehicle entry
            cursor.execute("""INSERT INTO vehicle_entries 
                              (sts_id, vehicle_number, weight_of_waste, time_of_arrival, time_of_departure)
                              VALUES (?, ?, ?, ?, ?)""",
                           (sts_id, vehicle_number, weight_of_waste, time_of_arrival, time_of_departure))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Vehicle entry added successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        



class CreateLandfillSite(Resource):
    def post(self):
        data = request.get_json()

        site_name = data.get('site_name')
        capacity = data.get('capacity')
        operational_timespan = data.get('operational_timespan')
        gps_longitude = data.get('gps_longitude')
        gps_latitude = data.get('gps_latitude')

        if not all([site_name, capacity, operational_timespan, gps_longitude, gps_latitude]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Insert landfill site data
            cursor.execute("""INSERT INTO landfill_sites 
                              (site_name, capacity, operational_timespan, gps_longitude, gps_latitude)
                              VALUES (?, ?, ?, ?, ?)""",
                           (site_name, capacity, operational_timespan, gps_longitude, gps_latitude))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Landfill site created successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)
        


# Can assign one or more managers to a landfill site
class AssignLandfillManagers(Resource):
    def post(self):
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
        



class AddDumpEntry(Resource):
    def post(self):
        data = request.get_json()

        # print(data)

        landfill_id = data.get('landfill_id')
        vehicle_id = data.get('vehicle_id')
        weight_of_waste = data.get('weight_of_waste')
        time_of_arrival = data.get('time_of_arrival')
        time_of_departure = data.get('time_of_departure')

        # print(landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure)

        if not all([landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure]):
            return make_response(jsonify({'error': 'Missing required fields'}), 400)

        try:
            conn = sqlite3.connect('sqlite.db')
            cursor = conn.cursor()

            # Check if landfill site exists
            cursor.execute("SELECT * FROM landfill_sites WHERE landfill_id=?", (landfill_id,))
            landfill_site = cursor.fetchone()
            if not landfill_site:
                return make_response(jsonify({'error': 'Landfill site not found'}), 404)


            # Check if adding this dump entry will exceed the capacity of the landfill site
            cursor.execute("SELECT SUM(weight_of_waste) FROM dump_entries WHERE landfill_id=?", (landfill_id,))
            total_waste = cursor.fetchone()[0] or 0
            if total_waste + weight_of_waste > landfill_site[2]:  # landfill_site[2] = capacity
                return make_response(jsonify({'error': 'Adding this dump entry will exceed the capacity of the landfill site'}), 400)

            # Insert dump entry
            cursor.execute("""INSERT INTO dump_entries 
                              (landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure)
                              VALUES (?, ?, ?, ?, ?)""",
                           (landfill_id, vehicle_id, weight_of_waste, time_of_arrival, time_of_departure))

            conn.commit()
            conn.close()

            return make_response(jsonify({'msg': 'Dump entry added successfully'}), 200)

        except sqlite3.Error as e:
            return make_response(jsonify({'error': 'Database error', 'details': str(e)}), 500)