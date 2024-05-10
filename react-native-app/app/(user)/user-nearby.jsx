import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout, Polyline, Circle } from 'react-native-maps';
import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../assets/configs.json';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
const apiKey = 'AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70';

const fetchRouteCoordinates = async (source, target) => {
    try {
        console.log(source, target)
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
    return coordinates;
};



const Nearby = () => {
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

    const [destination, setDestination] = useState(null);

    useEffect(() => {
        navigation.setOptions({
            title: 'Nearby Facilities'
        });
        getCurrentLocation();
    }, [coordinates]);


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
        } catch (error) {
            console.error('Error getting current location:', error);
        }
    };

    const showRoute = async(destination)=>{
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

    return (
        <>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={
                        currentLocation
                    }
                    showsUserLocation={true}
                >
                    {/* Render markers for start and end points */}
                    {markers.map((coord, index) => (
                        <Marker
                            key={index}
                            coordinate={coord}
                            title={index === 0 ? 'Start' : 'End'}
                            onPress={()=>{
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
                        placeholder="Search Location"
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

export default Nearby;
