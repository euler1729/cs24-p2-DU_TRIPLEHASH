from flask import request, jsonify, make_response
from flask_restful import Resource


# Own defined moduless
from database import Database
from utils import Utils

class Posts(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    # Create a new post
    def post(self):
        try:
            data = request.get_json()

            # Get user id, post content and image attached
            if 'user_id' not in data:
                return make_response(jsonify({'msg':'User Id is required!'}), 400)
             
            if 'image' not in data:
                data['image'] = ''

            if 'post_content' not in data:
                data['post_content'] = ''


            if 'image' not in data and 'post_content' not in data:
                return make_response(jsonify({'msg':'Both image and post content cannot be empty!'}), 400)


            # Insert the new post into the database
            self.database.execute(
                'INSERT INTO user_posts (user_id, post_content, image) VALUES (?, ?, ?)',
                (data['user_id'], data['post_content'], data['image'])
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Post created successfully'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

    # Get all posts
    def get(self):
        try:
            posts = self.database.execute('SELECT * FROM user_posts').fetchall()
            return make_response(jsonify({'posts': posts}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)


class UserPosts(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    # Get posts by specific user
    def get_by_id(self, id):
        try:
            posts = self.database.execute(
                'SELECT * FROM user_posts WHERE user_id=?', (id)
            ).fetchall()
            return make_response(jsonify({'user_posts': posts}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

    # Update a specific post
    def put(self, id):
        try:
            data = request.get_json()
            
            if 'image' not in data:
                data['image'] = ''

            if 'post_content' not in data:
                data['post_content'] = ''

            if 'image' not in data and 'post_content' not in data:
                return make_response(jsonify({'msg':'Both image and post content cannot be empty!'}), 400)

            # Update the post in the database
            self.database.execute(
                'UPDATE user_posts SET image=?, post_content=?, approved=? WHERE post_id=?',
                (data['image'], data['post_content'], 0, id)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Post updated successfully and waiting for admin approval'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

    # Delete a specific post
    def delete(self, id):
        try:
            # Delete the post from the database
            self.database.execute(
                'DELETE FROM user_posts WHERE post_id=?', (id,)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Post deleted successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)



class AdminPostApproval(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()

    def put(self, post_id):
        try:
            # Check if the post with the specified post_id exists
            post = self.database.execute(
                'SELECT * FROM user_posts WHERE post_id=?', (post_id,)
            ).fetchone()
            
            if not post:
                return make_response(jsonify({'msg': 'Post not found'}), 404)

            # Update the approved status of the post in the database
            self.database.execute(
                'UPDATE user_posts SET approved=? WHERE post_id=?',
                (1, post_id,)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Post approval status updated successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)



    def delete(self, post_id):
        try:
            # Check if the post with the specified post_id exists
            post = self.database.execute(
                'SELECT * FROM user_posts WHERE post_id=?', (post_id,)
            ).fetchone()

            if not post:
                return make_response(jsonify({'msg': 'Post not found'}), 404)

            # Delete the post from the database
            self.database.execute(
                'DELETE FROM user_posts WHERE post_id=?', (post_id,)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Post deleted successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)

