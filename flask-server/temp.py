import requests

# Replace with your Google Maps API key
API_KEY = "YOUR_API_KEY"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

# Dictionary of wards with detailed areas
wards = {
    "ward_1": [
        "Uttara Model Town 1 to 10 Sector, Dhaka, Bangladesh",
        "Abdullahpur, Dhaka, Bangladesh",
        "Purakair, Dhaka, Bangladesh",
        "Shailpur, Dhaka, Bangladesh",
        "Fayadabad, Dhaka, Bangladesh",
        "Bawnia, Dhaka, Bangladesh",
        "Dakshin Khan, Dhaka, Bangladesh",
        "Ranabhola, Dhaka, Bangladesh"
    ],
    "ward_17": [
        "Khilkhet, Dhaka, Bangladesh",
        "Kuril, Dhaka, Bangladesh",
        "Kuratoli, Dhaka, Bangladesh",
        "Joarsahara, Dhaka, Bangladesh",
        "Alipara, Dhaka, Bangladesh",
        "Jagannathpur, Dhaka, Bangladesh",
        "Nikunja-1, Dhaka, Bangladesh",
        "Nikunja-2, Dhaka, Bangladesh",
        "Tanpara, Dhaka, Bangladesh"
    ],
    "ward_2": [
        "Section-12, Block-A, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-B, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-C, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-D, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-E, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-T, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-Dh, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-P, Mirpur, Dhaka, Bangladesh",
        "Section-9, Block-Kh, Mirpur, Dhaka, Bangladesh",
        "Burir Tek, Mirpur, Dhaka, Bangladesh",
        "Kalshi Sarkar Bari, Mirpur, Dhaka, Bangladesh",
        "Block-P extended Sagupta, Mirpur, Dhaka, Bangladesh"
    ],
    "ward_3": [
        "Section-10, Block-A, Mirpur, Dhaka, Bangladesh",
        "Section-10, Block-C, Mirpur, Dhaka, Bangladesh",
        "Section-10, Block-D, Mirpur, Dhaka, Bangladesh",
        "Section-11, Block-C, Mirpur, Dhaka, Bangladesh",
        "Road/Avenue-5 Madina Nagar, Dhaka, Bangladesh",
        "Avenue-3, Dhaka, Bangladesh"
    ],
    "ward_4": [
        "Section-13, Dhaka, Bangladesh",
        "Section-13/A, Dhaka, Bangladesh",
        "Section-13/B, Dhaka, Bangladesh",
        "Section-13/C, Dhaka, Bangladesh",
        "Tin Shed, Dhaka, Bangladesh",
        "Section-14, Dhaka, Bangladesh",
        "Baishtek, Dhaka, Bangladesh",
        "Section-15, Dhaka, Bangladesh"
    ],
    "ward_5": [
        "Section-11, Block-A, Mirpur, Dhaka, Bangladesh",
        "Section-11, Block-B, Mirpur, Dhaka, Bangladesh",
        "Section-11, Block-C, Mirpur, Dhaka, Bangladesh",
        "Section-11, Block-D, Mirpur, Dhaka, Bangladesh",
        "Section-11, Block-E, Mirpur, Dhaka, Bangladesh",
        "Section-11, Block-F, Mirpur, Dhaka, Bangladesh",
        "Palash Nagar, Mirpur, Dhaka, Bangladesh"
    ],
    "ward_6": [
        "Pallabi, Dhaka, Bangladesh",
        "Extended Pallabi, Dhaka, Bangladesh",
        "New Pallabi Section-7, Dhaka, Bangladesh",
        "Milk Vita Road, Dhaka, Bangladesh",
        "Sujat Nagar, Dhaka, Bangladesh",
        "Harunabad, Dhaka, Bangladesh",
        "Mallika Housing Arambag, Dhaka, Bangladesh",
        "Arifabad, Dhaka, Bangladesh",
        "Chayanir, Dhaka, Bangladesh",
        "Section-6, Block-C, Mirpur, Dhaka, Bangladesh",
        "Section-6, Block-D, Mirpur, Dhaka, Bangladesh",
        "Section-6, Block-E, Mirpur, Dhaka, Bangladesh",
        "Section-6, Block-T, Mirpur, Dhaka, Bangladesh",
        "Section-6, Block-Jh, Mirpur, Dhaka, Bangladesh",
        "Alubdi, Dhaka, Bangladesh",
        "Duaripara, Dhaka, Bangladesh",
        "6-J, Dhaka, Bangladesh",
        "Rupnagar Tin Shed, Dhaka, Bangladesh",
        "Eastern Housing second phase area, Dhaka, Bangladesh"
    ],
    "ward_7": [
        "Section-2, Block-A, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-B, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-C, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-D, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-E, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-F, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-G (1), Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-H, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-K, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-J, Mirpur, Dhaka, Bangladesh",
        "Rupnagar Residential Area, Mirpur, Dhaka, Bangladesh",
        "Section-7 Block-A, Mirpur, Dhaka, Bangladesh",
        "Section-2, Block-Ch, Mirpur, Dhaka, Bangladesh",
        "Flat 5 buildings, Mirpur, Dhaka, Bangladesh",
        "Duaripara, Dhaka, Bangladesh",
        "6-A, Mirpur, Dhaka, Bangladesh",
        "6-B, Mirpur, Dhaka, Bangladesh",
        "6-T, Mirpur, Dhaka, Bangladesh",
        "6-J, Mirpur, Dhaka, Bangladesh"
    ],
    "ward_8": [
        "Section-1, WAPDA Colony, Mirpur, Dhaka, Bangladesh",
        "Block-A, Mirpur, Dhaka, Bangladesh",
        "Block-B, Mirpur, Dhaka, Bangladesh",
        "Block-C, Mirpur, Dhaka, Bangladesh",
        "Block-D, Mirpur, Dhaka, Bangladesh",
        "Block-E, Mirpur, Dhaka, Bangladesh",
        "Block-F, Mirpur, Dhaka, Bangladesh",
        "Block-G, Mirpur, Dhaka, Bangladesh",
        "Block-H, Mirpur, Dhaka, Bangladesh",
        "Commercial Plot, Mirpur, Dhaka, Bangladesh",
        "Local House, Mirpur, Dhaka, Bangladesh",
        "House-Kh, Mirpur, Dhaka, Bangladesh",
        "House-G, Mirpur, Dhaka, Bangladesh",
        "Al Kamal Housing, Mirpur, Dhaka, Bangladesh",
        "Zoo Residential Area, Mirpur, Dhaka, Bangladesh",
        "Nawab's Garden, Mirpur, Dhaka, Bangladesh",
        "Goran Chatbari, Mirpur, Dhaka, Bangladesh",
        "BISF Staff Quarters, Mirpur, Dhaka, Bangladesh",
        "Kumi Shah Mazar, Mirpur, Dhaka, Bangladesh",
        "Box Nagar, Mirpur, Dhaka, Bangladesh",
        "North Bishil, Mirpur, Dhaka, Bangladesh",
        "Priyanka Housing, Mirpur, Dhaka, Bangladesh",
        "New C Block, Mirpur, Dhaka, Bangladesh",
        "Botanical Garden Residential Area, Mirpur, Dhaka, Bangladesh"
    ],
    "ward_15": [
        "Manikdi, Dhaka, Bangladesh",
        "Matikata, Dhaka, Bangladesh",
        "Balughata, Dhaka, Bangladesh",
        "Lalarasya, Dhaka, Bangladesh",
        "Dhamalkot, Dhaka, Bangladesh",
        "Alubdi Tek, Dhaka, Bangladesh",
        "Baigar Tek, Dhaka, Bangladesh",
        "Barnotek, Dhaka, Bangladesh",
        "Bhashantek, Dhaka, Bangladesh"
    ],
    "ward_18": [
        "Baridhara Residential Area, Block-I, Dhaka, Bangladesh",
        "Baridhara Residential Area, Block-K, Dhaka, Bangladesh",
        "Baridhara Residential Area, Block-J, Dhaka, Bangladesh",
        "Kalachandpur, Dhaka, Bangladesh",
        "Nadda, Dhaka, Bangladesh",
        "Shahjadpur, Dhaka, Bangladesh"
    ],
    "ward_19": [
        "Banani, Dhaka, Bangladesh",
        "Gulshan 1, Dhaka, Bangladesh",
        "Gulshan 2, Dhaka, Bangladesh",
        "Korail, Dhaka, Bangladesh"
    ],
    "ward_20": [
        "Mohakhali, Dhaka, Bangladesh",
        "Mohakhali-Gulshan 1 Link Road, Dhaka, Bangladesh",
        "Public Health InstituteTo get the coordinates for each ward area using the Google Maps Geocoding API, follow the code below. This will help you fetch and print the latitude and longitude for each area in the provided wards dictionary.

```python
import requests

# Replace with your Google Maps API key
API_KEY = "YOUR_API_KEY"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

# Dictionary of wards with detailed areas
wards = {
    "ward_1": [
        "Uttara Model Town 1 to 10 Sector, Dhaka, Bangladesh",
        "Abdullahpur, Dhaka, Bangladesh",
        "Purakair, Dhaka, Bangladesh",
        "Shailpur, Dhaka, Bangladesh",
        "Fayadabad, Dhaka, Bangladesh",
        "Bawnia, Dhaka, Bangladesh",
        "Dakshin Khan, Dhaka, Bangladesh",
        "Ranabhola, Dhaka, Bangladesh"
    ],
    "ward_17": [
        "Khilkhet, Dhaka, Bangladesh",
        "Kuril, Dhaka, Bangladesh",
        "Kuratoli, Dhaka, Bangladesh",
        "Joarsahara, Dhaka, Bangladesh",
        "Alipara, Dhaka, Bangladesh",
        "Jagannathpur, Dhaka, Bangladesh",
        "Nikunja-1, Dhaka, Bangladesh",
        "Nikunja-2, Dhaka, Bangladesh",
        "Tanpara, Dhaka, Bangladesh"
    ],
    "ward_2": [
        "Section-12, Block-A, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-B, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-C, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-D, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-E, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-T, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-Dh, Mirpur, Dhaka, Bangladesh",
        "Section-12, Block-P, Mirpur, Dhaka, Bangladesh",
        "Section-9, Block-Kh, Mirpur, Dhaka, Bangladesh",
        "Burir Tek, Mirpur, Dhaka, Bangladesh",
        "Kalshi Sarkar Bari, Mirpur, Dhaka, Bangladesh",
        "Block-P extended Sagupta, Mirpur, Dhaka, Bangladesh"
    ],
    # Add other wards in similar format...
}

def get_coordinates(address):
    params = {
        "address": address,
        "key": API_KEY
    }
    response = requests.get(GEOCODE_URL, params=params)
    if response.status_code == 200:
        results = response.json().get("results")
        if results:
            location = results[0]["geometry"]["location"]
            return location["lat"], location["lng"]
    return None, None

def fetch_ward_coordinates(wards):
    ward_coordinates = {}
    for ward, areas in wards.items():
        ward_coordinates[ward] = []
        for area in areas:
            lat, lng = get_coordinates(area)
            if lat and lng:
                ward_coordinates[ward].append({"area": area, "lat": lat, "lng": lng})
            else:
                ward_coordinates[ward].append({"area": area, "lat": None, "lng": None})
    return ward_coordinates

ward_coordinates = fetch_ward_coordinates(wards)

for ward, coordinates in ward_coordinates.items():
    print(f"Coordinates for {ward}:")
    for coordinate in coordinates:
        print(f"  Area: {coordinate['area']}, Coordinates: ({coordinate['lat']}, {coordinate['lng']})")
