from flask_restful import Resource
from flask import request, jsonify, make_response
from TokenManager import decode_token
from database import Database
from utils import Utils


class Employee(Resource):

    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def get(self, employee_id=None):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                if employee_id:
                    self.database.execute(
                        'SELECT * FROM employee WHERE employee_id = ?', (employee_id,))
                    e = self.database.fetchone()
                    if e:
                        emp = {
                            "employee_id": e[0],
                            "full_name": e[1],
                            "job_title": e[2],
                            "payment_rate_per_hour": e[3],
                            "assigned_collection_route": e[4],
                            "dob": e[5],
                            "date_of_hire": e[6],
                            "contact": e[7],
                        }
                        return make_response(jsonify({"employee": emp}), 200)
                    else:
                        return make_response(jsonify({"msg": "Employee not found"}), 404)

                self.database.execute('SELECT * FROM employee LIMIT 10')
                employees = self.database.fetchall()
                res = []
                for e in employees:
                    emp = {
                        "employee_id": e[0],
                        "full_name": e[1],
                        "job_title": e[2],
                        "payment_rate_per_hour": e[3],
                        "assigned_collection_route": e[4],
                        "dob": e[5],
                        "date_of_hire": e[6],
                        "contact": e[7],
                    }
                    res.append(emp)
                return make_response(jsonify({"employees": res}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 401)

    def post(self):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                print(data)
                self.database.execute(
                    'INSERT INTO employee (employee_id, full_name, job_title, payment_rate_per_hour, assigned_collection_route, dob, date_of_hire, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    (
                        data['employee_id'],
                        data['full_name'],
                        data['job_title'],
                        data['payment_rate_per_hour'],
                        data['assigned_collection_route'],
                        data['date_of_birth'],
                        data['date_of_hire'],
                        data['contact_information'],
                    )
                )
                self.database.commit()
                return make_response(jsonify({"msg": "Employee added successfully"}), 201)
        except Exception as e:
            self.database.rollback()
            return make_response(jsonify({'msg': str(e)}), 400)

    def put(self, employee_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                data = request.get_json()
                self.database.execute(
                    'UPDATE employee SET full_name = ?, job_title = ?, payment_rate_per_hour = ?, assigned_collection_route = ?, dob = ?, date_of_hire = ?, contact = ? WHERE employee_id = ?',
                    (
                        data['full_name'],
                        data['job_title'],
                        data['payment_rate_per_hour'],
                        data['assigned_collection_route'],
                        data['dob'],
                        data['date_of_hire'],
                        data['contact'],
                        employee_id
                    )
                )
                self.database.commit()
                return make_response(jsonify({"msg": "Employee updated successfully"}), 200)
        except Exception as e:
            self.database.rollback()
            return make_response(jsonify({'msg': str(e)}), 400)

    def delete(self, employee_id):
        try:
            info = self.utils.getInfoFromToken(request)
            if info:
                self.database.execute(
                    'DELETE FROM employee WHERE employee_id = ?', (employee_id,))
                self.database.commit()
                return make_response(jsonify({"msg": "Employee deleted successfully"}), 200)
        except Exception as e:
            self.database.rollback()
            return make_response(jsonify({'msg': str(e)}), 400)
    # def options(self):
    #     try:
    #         info = self.utils.getInfoFromToken(request)
    #         if info:
    #             data = request.get_json()
    #             self.database.execute(
    #                 'INSERT INTO employee (full_name, job_title, payment_rate_per_hour, assigned_collection_route, dob, date_of_hire, contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
    #                 (
    #                     data['full_name'],
    #                     data['job_title'],
    #                     data['payment_rate_per_hour'],
    #                     data['assigned_collection_route'],
    #                     data['dob'],
    #                     data['date_of_hire'],
    #                     data['contact']
    #                 )
    #             )
    #             self.database.commit()
    #             return make_response(jsonify({"msg": "Employee added successfully"}), 201)
    #     except Exception as e:
    #         self.database.rollback()
    #         return make_response(jsonify({'msg': str(e)}), 400)
        
