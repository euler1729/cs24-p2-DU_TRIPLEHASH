from flask import request, jsonify, make_response
from flask_restful import Resource


from database import Database
from utils import Utils

class TicketSystem(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    # def get(self, ticket_id):
    #     try:
    #         tickets = self.database.execute(
    #             'SELECT * FROM tickets WHERE _id=?', (ticket_id,)
    #         ).fetchall()
    #         return make_response(jsonify({'user_tickets': tickets}), 200)
    #     except Exception as e:
    #         return make_response(jsonify({'msg': str(e)}), 500)

    def post(self):
        try:
            data = request.get_json()

            # Extract ticket details from request
            user_id = data.get('user_id')
            problem_type = data.get('problem_type')
            problem_description = data.get('problem_description')
            posted_anonymously = data.get('posted_anonymously')
            location = data.get('location')
            image = data.get('image')

            if not image:
                image = ''
            

            # Validate required fields
            if not problem_type:
                return make_response(jsonify({'msg': 'Problem type is required!'}), 400)
            if not problem_description:
                return make_response(jsonify({'msg': 'Problem description is required!'}), 400)
            if not location:
                return make_response(jsonify({'msg': 'Location is required!'}), 400)

            # Insert ticket into the database
            self.database.execute(
                'INSERT INTO tickets (user_id, problem_type, problem_description, posted_anonymously, location, image) VALUES (?, ?, ?, ?, ?, ?)',
                (user_id, problem_type, problem_description, posted_anonymously, location, image)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Ticket created successfully'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

    def get(self):
        try:
            tickets = self.database.execute('SELECT * FROM tickets').fetchall()
            return make_response(jsonify({'tickets': tickets}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

    def put(self, ticket_id):
        try:
            data = request.get_json()

            # Extract updated fields from request
            problem_type = data.get('problem_type')
            problem_description = data.get('problem_description')
            posted_anonymously = data.get('posted_anonymously')
            location = data.get('location')
            image = data.get('image')

            # Update ticket in the database
            self.database.execute(
                'UPDATE tickets SET problem_type=?, problem_description=?, posted_anonymously=?, location=?, image=? WHERE ticket_id=?',
                (problem_type, problem_description, posted_anonymously, location, image, ticket_id)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Ticket updated successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

    def delete(self, ticket_id):
        try:
            # Delete ticket from the database
            self.database.execute(
                'DELETE FROM tickets WHERE ticket_id=?', (ticket_id,)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Ticket deleted successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)


class UserTickets(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def get(self, user_id):
        try:
            tickets = self.database.execute(
                'SELECT * FROM tickets WHERE user_id=?', (user_id,)
            ).fetchall()
            return make_response(jsonify({'user_tickets': tickets}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)