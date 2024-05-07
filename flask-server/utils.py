import jwt
import json
from werkzeug.security import generate_password_hash, check_password_hash

class Utils():
    @staticmethod
    def getInfoFromToken(request):
        '''
            Get the user information from the token
            @param: request
            @return: info
        '''
        token = request.headers['Authorization'].split(' ')[1]
        try:
            with open('config.json', 'r') as f:
                config = json.load(f)
                key = config['KEY']
                info = jwt.decode(token, key, algorithms=["HS256"])
                return info
        except Exception as e:
            return None
    @staticmethod
    def hash_password(password):
        '''
            Hash the password
            @param: password
            @return: hash
        '''
        return generate_password_hash(password)
            
    @staticmethod
    def check_password_hash(hash, password):
        '''
            Check the password hash
            @param: hash, password
            @return: boolean
        '''
        return check_password_hash(hash, password)