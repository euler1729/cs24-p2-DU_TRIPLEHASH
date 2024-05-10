from flask import request, jsonify, make_response
from flask_restful import Resource


# Own defined moduless
from database import Database
from utils import Utils


class PostInteraction(Resource):
    def __init__(self):
        self.database = Database()
        self.utils = Utils()


    # Get all comments for a specific post
    def get(self, post_id):
        try:
            # Fetch all comments for the given post ID
            comments = self.database.execute(
                'SELECT * FROM post_comments WHERE post_id = ?', (post_id,)).fetchall()

            return make_response(jsonify({'comments': comments}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)


    # Add comment to a post
    def post(self, post_id):
        try:
            data = request.get_json()
            comment_text = data.get('comment_text')
            user_id = data.get('user_id')  # Assuming user ID is provided in the request data

            # Check if the comment text and user ID are provided
            if not comment_text or not user_id:
                return make_response(jsonify({'msg': 'Comment text and user ID are required'}), 400)

            # Check if the post exists
            post = self.database.execute(
                'SELECT * FROM user_posts WHERE post_id = ?',(post_id,)
            ).fetchone()

            if not post:
                return make_response(jsonify({'msg': 'Post does not exist'}), 404)

            # Insert the comment into the database along with the user ID
            self.database.execute(
                'INSERT INTO post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)',
                (post_id, user_id, comment_text)
            )
            self.database.commit()

            return make_response(jsonify({'msg': 'Comment added successfully'}), 201)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)



    def put(self, post_id):
        try:
            data = request.get_json()

            # Check if the post exists
            post = self.database.execute(
                'SELECT * FROM user_posts WHERE post_id = ?',
                (post_id,)
            ).fetchone()

            if not post:
                return make_response(jsonify({'msg': 'Post does not exist'}), 404)

            # Check if the user has already liked the post
            user_id = data.get('user_id')  # Assuming user ID is provided in the request data
            existing_like = self.database.execute(
                'SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?',
                (user_id, post_id)
            ).fetchone()

            if existing_like:
                # User has already liked the post, so remove the like
                self.database.execute(
                    'DELETE FROM post_likes WHERE user_id = ? AND post_id = ?',
                    (user_id, post_id)
                )

                # Update the like count in the user_posts table
                self.database.execute(
                    'UPDATE user_posts SET likes_count = likes_count - 1 WHERE post_id = ?',
                    (post_id,)
                )

                self.database.commit()

                return make_response(jsonify({'msg': 'Like removed successfully'}), 200)

            # User has not liked the post before, so insert the like
            self.database.execute(
                'INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)',
                (user_id, post_id)
            )

            # Update the like count in the user_posts table
            self.database.execute(
                'UPDATE user_posts SET likes_count = likes_count + 1 WHERE post_id = ?',
                (post_id,)
            )

            self.database.commit()

            return make_response(jsonify({'msg': 'Like added successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'msg': str(e)}), 500)



