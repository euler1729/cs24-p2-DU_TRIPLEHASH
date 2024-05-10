import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout, Polyline, Circle } from 'react-native-maps';
import { SafeAreaView, StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../assets/configs.json';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const Nearby = () => {
    const navigation = useNavigation();
    const [coordinates, setCoordinates] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        navigation.setOptions({
            title: 'Nearby Facilities'
        });

        // Fetch route coordinates here
        fetchRouteCoordinates();

        // Generate random nearby markers
        generateRandomMarkers();

        // Fetch current location
        getCurrentLocation();
    }, []);

    const fetchRouteCoordinates = () => {
        // Make API call to get route coordinates
        // Replace these mock coordinates with actual API call
        const routeCoordinates = [
            { latitude: 23.8103, longitude: 90.4125 },
            { latitude: 23.8107, longitude: 90.4115 }, // Sample destination coordinates
        ];

        setCoordinates(routeCoordinates);
    };

    const generateRandomMarkers = () => {
        // Generate random markers near the initial location
        const randomMarkers = Array.from({ length: 5 }, () => ({
            latitude: 23.8103 + (Math.random() - 0.5) * 0.1,
            longitude: 90.4125 + (Math.random() - 0.5) * 0.1,
        }));

        // Update the state with the random markers
        setCoordinates((prevCoordinates) => [...prevCoordinates, ...randomMarkers]);
    };

    const getCurrentLocation = async () => {
        // Check if location permission is granted
        // const { status } = await Permissions.askAsync(Permissions.LOCATION);
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
                    initialRegion={{
                        latitude: 23.8103,
                        longitude: 90.4125,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                >
                    {/* Render markers for start and end points */}
                    {coordinates.map((coord, index) => (
                        <Marker
                            key={index}
                            coordinate={coord}
                            title={index === 0 ? 'Start' : 'End'}
                        >
                            <Callout>
                                <View className='flex-col'>
                                    <Text className='font-pmedium'>Dust Bean</Text>
                                    <Text>Description: Bean for collecting dry waste</Text>
                                    <Text>[Link](https://example.com)</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                    {/* Render polyline for route */}
                    {/* <Polyline
                        coordinates={coordinates}
                        strokeColor="#000"
                        strokeWidth={4}
                    /> */}

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
        top: 20,
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
