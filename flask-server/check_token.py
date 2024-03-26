import jwt
import json

def check_token(token):
    try:
        with open('config.json', 'r') as f:
            config = json.load(f)
            key = config['KEY']
            info = jwt.decode(token, key, algorithms=["HS256"])
            return info
    except Exception as e:
        return None