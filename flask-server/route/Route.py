
import requests

class Route():
    def __init__(self):
        self.key = 'AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70'
        self.url = 'https://maps.googleapis.com/maps/api/directions/json'
        self.distance = None
        self.duration = None
        self.start_location = None
        self.end_location = None
        self.start_address = None
        self.end_address = None
        self.steps = None
        self.status_code = None

    def getRoute(self, origin, destination):
        params = {
            'origin': origin,
            'destination': destination,
            'key': self.key
        }
        response = requests.get(self.url, params=params)
        self.status_code = response.status_code
        if response.status_code == 200:
            data = response.json()
            self.distance = data['routes'][0]['legs'][0]['distance']['text']
            self.duration = data['routes'][0]['legs'][0]['duration']['text']
            self.end_address = data['routes'][0]['legs'][0]['end_address']
            self.end_location = data['routes'][0]['legs'][0]['end_location']
            self.start_address = data['routes'][0]['legs'][0]['start_address']
            self.start_location = data['routes'][0]['legs'][0]['start_location']
            self.steps = data['routes'][0]['legs'][0]['steps']

            return self.__dict__
        else:
            return None


route = Route()

print(route.getRoute('TSC, Dhaka University', 'Mirpur 10'))