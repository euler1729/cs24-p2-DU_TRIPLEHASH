import jwt
import json

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