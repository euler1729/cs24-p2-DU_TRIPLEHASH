import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { GoogleMap, useLoadScript, Marker, Autocomplete, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';
import { Typography, TextField, Button, Grid, Paper, makeStyles, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import api from '../API';
const KEY = 'AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70';

const MapComponent = ({ props }) => {
    console.log(props)
    const libraries = ['places', 'geometry', 'drawing', 'visualization'];
    const mapContainerStyle = {
        width: '50vw',
        height: '400px',
    };
    const center = {
        lat: 23.7191, // default latitude
        lng: 90.4338, // default longitude
    };
    const [position, setPosition] = useState(props.src);
    const [directions, setDirections] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [trafficLayer, setTrafficLayer] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: KEY,
        libraries,
    });

    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);

    const onLoad = map => {
        mapRef.current = map;
    };

    const onMapClick = event => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPosition(newPosition);
        // onLocationChange(newPosition);
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        console.log(place);
        if (place?.geometry) {
            console.log(place.geometry.viewport.Jh.lo, place.geometry.viewport.Zh.lo);
            const position = {
                lat: place?.geometry?.viewport?.Zh?.lo,
                lng: place?.geometry?.viewport?.Jh?.lo,
            }
            setPosition(position);
            // onLocationChange(position);
        }
    };

    const calculateDirections = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: position,
                destination: props.dest, // Set your destination here
                travelMode: 'DRIVING',
            },
            (result, status) => {
                if (status === 'OK') {
                    setDirections(result);
                    if (result.routes && result.routes.length > 0) {
                        setSelectedRoute(result.routes[0]);
                    }
                } else {
                    console.error(`Directions request failed due to ${status}`);
                }
            }
        );
    };

    const toggleTrafficLayer = () => {
        if (!trafficLayer) {
            const newTrafficLayer = new window.google.maps.TrafficLayer();
            newTrafficLayer.setMap(mapRef.current);
            setTrafficLayer(newTrafficLayer);
        } else {
            trafficLayer.setMap(null);
            setTrafficLayer(null);
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return (
            <div>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={16}
                center={position}
                onClick={onMapClick}
                onLoad={onLoad}
            >
                <Marker position={position} />
                {directions && selectedRoute && (
                    <DirectionsRenderer
                        directions={directions}
                        routeIndex={selectedRoute}
                    />
                )}
                <Autocomplete
                    onLoad={autocomplete => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={onPlaceChanged}
                >
                    <TextField
                        type="text"
                        placeholder="Search for location"
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `20vw`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-120px',
                            backgroundColor: '#ffffff',
                        }}
                    />
                </Autocomplete>
                <TrafficLayer autoUpdate />
            </GoogleMap>
            <div style={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row', margin: '10px' }}>
                <Button variant="contained" color="primary" onClick={calculateDirections}>
                    Show Route
                </Button>
                <Button variant="contained" color="secondary" onClick={toggleTrafficLayer}>
                    Toggle Traffic
                </Button>
            </div>
        </div>
    );
};

const Route = () => {
    const cookies = new Cookies();
    const divStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh', // Adjust as needed
    };
    const [props, setProps] = useState({
        src: {
            lat: 23.7191, // default latitude
            lng: 90.4338, // default longitude
        },
        dest: {
            lat: 23.8028,
            lng: 90.3748
        }
    });
    useEffect(() => {
        try {
            // api.get('/route', {
            //     headers: {
            //         "Authorization": `Bearer ${cookies.get('access_token')}`,
            //     },
            //     withCredentials: true
            // }).then((response)=>{
            //     console.log(response);
            // }).catch((e)=>{
            //     console.log(e)
            // })
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <div style={divStyle}>
            <Typography variant="h4" gutterBottom>
                Route
            </Typography>
            <MapComponent props={props} />
        </div>
    );
}
export default Route;