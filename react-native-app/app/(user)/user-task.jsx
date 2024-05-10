import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Callout, Polyline, Circle } from 'react-native-maps';
import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../assets/configs.json';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
const apiKey = 'AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';


function sleep(ms) {
  return new Promise(resolve => {
      setTimeout(resolve, ms);
  });
}


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
  }
  if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
  }
}
async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
      content: {
          title: 'Import Task Near the Location',
          body: 'You have a task near the location. Capture the location and complete the task.',
      },
      trigger: {
          seconds: 5, // Time in seconds after which the notification will be shown
      },
  });
}
const fetchRouteCoordinates = async (source, target) => {
  try {
    // console.log(source, target)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${source.latitude},${source.longitude}&destination=${target.latitude},${target.longitude}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === 'OK') {
      // Extract route coordinates from the response
      const routeCoordinates = decodePolyline(data.routes[0].overview_polyline.points);
      // console.log(routeCoordinates)
      return routeCoordinates;
    } else {
      console.error('Error fetching route:', data.status);
    }
  } catch (error) {
    console.error('Error fetching route coordinates:', error);
  }
};

const decodePolyline = (encoded) => {
  let index = 0;
  const len = encoded.length;
  const coordinates = [];
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coordinates;
};

const generateRandomCoordinates = (count, center, radius) => {
  const coordinates = [];
  for (let i = 0; i < count; i++) {
    const y0 = center.latitude;
    const x0 = center.longitude;
    const u = Math.random();
    const v = Math.random();
    const w = radius * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    const xp = x / Math.cos(y0);
    const newlat = y + y0;
    const newlon = x + x0;
    coordinates.push({ latitude: newlat, longitude: newlon });
  }
  coordinates.push({ latitude: center.latitude + 0.1, longitude: center.longitude + 0.1 })
  return coordinates;
};



const Task = () => {
  const navigation = useNavigation();
  const [coordinates, setCoordinates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 23.8103,
    longitude: 90.4125,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState(generateRandomCoordinates(10, currentLocation, 0.1));
  const [photo, setPhoto] = useState(null);
  const [importandCord, setImportandCord] = useState([]);


  useEffect(() => {
    navigation.setOptions({
      title: 'Nearby Tasks'
    });
    if (markers) {
      for (let i = 0; i < markers.length; i++) {
        if (i & 1) {
          setImportandCord(i);
        }
      }
    }
    // const asnk = async () => {
    //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    // }
    // asnk();
    nearestBin();
    getCurrentLocation();
  }, [coordinates]);

const nearestBin = async () => {
    const coord = await getCurrentLocation();
    let mn = 999999;
    let index = 0;
    for (let i = 0; i < markers.length; i++) {
      const distance = Math.sqrt((markers[i].latitude - coord.latitude) ** 2 + (markers[i].longitude - coord.longitude) ** 2);
      if(distance < mn){
        mn = distance;
        index = i;
      }
    }
    console.log('min: ', mn)
    showRoute(markers[index])
    sleep(10000)
  }

  // const timeOutId = setTimeout(() => {
  //   nearestBin();
  // }, 50000);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to access your current location.');
      return;
    }

    // Get current location
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const showRoute = async (destination) => {
    setCoordinates(await fetchRouteCoordinates(currentLocation, destination));
  }


  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70`
      );
      const data = await response.json();
      // Extract relevant data from the response
      // For example, set the searchResult state with the data
      setSearchResult(data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const pickImage = async () => {
    try {
        if (Platform.OS === 'android') {
            const hasPermission = await grantGalleryPermission();
            if (!hasPermission) {
                console.log('Permission denied');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });
        if (!result.cancelled && result.assets[0].uri) {
            setPhoto(result.assets[0].uri);
        } else {
            console.log("Image picker was cancelled or returned null URI");
        }
    } catch (error) {
        console.error("Error picking image:", error);
    }
};

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={
            currentLocation
          }
          showsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
          
        >
          {/* Render markers for start and end points */}
          {markers.map((coord, index) => (
            <Marker
              key={index}
              coordinate={coord}
              title={index === 0 ? 'Start' : 'End'}
              onPress={() => {
                showRoute(coord)
              }}
            >
              <Callout>
                <View className='flex-col'>
                  <Text className='font-pmedium'>Dust Bean</Text>
                  <Text>Description: Bean for collecting dry waste</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {/* Render polyline for route */}
          {coordinates &&
            <Polyline
              coordinates={coordinates}
              strokeColor='green'
              strokeWidth={4}
            />
          }

          {/* Render circle for current location */}
          {currentLocation && (
            <Circle
              center={currentLocation}
              radius={50} // You can adjust the radius as needed
              fillColor="rgba(255, 0, 0, 0.5)" // Red color with 50% opacity
              strokeColor="transparent" // Transparent border
            />
          )}
        </MapView>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search location"
          />
          <Button title="Search" onPress={handleSearch} />
        </View>
      </View>
      <StatusBar
        hidden={false}
        style="auto"
        backgroundColor={Colors.greenWhite}
        translucent={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: '80%',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 3,

  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
  },
});

export default Task;
