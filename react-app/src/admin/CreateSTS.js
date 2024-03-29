import React, { useState, useRef } from 'react';
import { Typography, TextField, Button, Grid, Paper, makeStyles, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import api from '../API';


import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';
const KEY = 'AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70';


const MapComponent = ({ onLocationChange }) => {
    const libraries = ['places', 'geometry', 'drawing', 'visualization'];
    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };
    const center = {
        lat: 23.7191, // default latitude
        lng: 90.4338, // default longitude
    };
    const [position, setPosition] = useState(center);

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
        onLocationChange(newPosition);
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
            onLocationChange(position);
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
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
            </GoogleMap>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    title: {
        fontWeight: 'bold',
        color: EcoSyncBrand.Colors.greenTeaDark,
    },
    paper: {
        padding: theme.spacing(3),
        backgroundColor: '#f5f5f5',
        borderRadius: theme.spacing(2),
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    form: {
        '& > *': {
            marginBottom: theme.spacing(2),
            width: '100%',
            backgroundColor: EcoSyncBrand.Colors.greenWhite,
        },
    },
    textField: {
        marginBottom: theme.spacing(2),
        color: EcoSyncBrand.Colors.green,
        backgroundColor: EcoSyncBrand.Colors.greenWhite,
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: EcoSyncBrand.Colors.green, // Green color
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: EcoSyncBrand.Colors.green, // Green color
        },
    },
    button: {
        fontWeight: 'bold',
        color: EcoSyncBrand.Colors.greenWhite,
        backgroundColor: EcoSyncBrand.Colors.green,
        '&:hover': {
            backgroundColor: EcoSyncBrand.Colors.greenTeaDark,
        },
    },
    circularProgress: {
        color: EcoSyncBrand.Colors.greenWhite,
        fontWeight: 'bold',
        marginLeft: theme.spacing(1), // Adjust spacing as needed
    },
}));

const CreateSTSPage = () => {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [sts, setSTS] = useState({
        ward_number: '',
        capacity_tonnes: '',
        gps_longitude: 90.4338,
        gps_latitude: 23.7191,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        setErrors({});

        const newErrors = {};
        if (!sts.ward_number) {
            newErrors.ward_number = 'Ward Number is required';
        }
        if (!sts.capacity_tonnes) {
            newErrors.capacity_tonnes = 'capacity_tonnes is required';
        } else if (isNaN(sts.capacity_tonnes) || sts.capacity_tonnes <= 0) {
            newErrors.capacity_tonnes = 'capacity_tonnes must be a positive number';
        }
        if (!sts.gps_longitude) {
            newErrors.gps_longitude = 'GPS Coordinates are required';
        }
        if (!sts.gps_latitude) {
            newErrors.gps_latitude = 'GPS Coordinates are required';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            api.post('/data-entry/create-sts', sts)
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    setDialogType('success');
                    setDialogMessage('STS created successfully');
                    setDialogOpen(true);
                    setSTS({
                        ward_number: '',
                        capacity_tonnes: '',
                        gps_longitude: 90.4338,
                        gps_latitude: 23.7191,
                    });
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setDialogType('error');
                    setDialogMessage('Failed to create STS');
                    setDialogOpen(true);
                });

        } catch (err) {
            console.log(err);
            setLoading(false);
            setDialogType('error');
            setDialogMessage('Failed to create STS');
            setDialogOpen(true);
        }
    };

    const handleLocationChange = (coords) => {
        console.log(coords)
        const lat = parseFloat(coords?.lat).toFixed(2);
        const lng = parseFloat(coords?.lng).toFixed(2);
        setSTS({ ...sts, gps_latitude: lat, gps_longitude: lng });
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h5" gutterBottom className={classes.title}>
                            Create New STS (Solid Waste Transfer Station)
                        </Typography>
                        <form className={classes.form}>
                            <TextField
                                name="ward_number"
                                className={classes.textField}
                                label="Ward Number"
                                variant="outlined"
                                value={sts.ward_number}
                                onChange={(e) => setSTS({ ...sts, ward_number: e.target.value })}
                                error={!!errors.ward_number}
                                helperText={errors.ward_number}
                            />
                            <TextField
                                name="capacity_tonnes"
                                className={classes.textField}
                                label="Capacity (in tonnes)"
                                variant="outlined"
                                type="number"
                                value={sts.capacity_tonnes}
                                onChange={(e) => setSTS({ ...sts, capacity_tonnes: e.target.value })}
                                error={!!errors.capacity_tonnes}
                                helperText={errors.capacity_tonnes}
                            />
                            <TextField
                                name="location"
                                className={classes.textField}
                                label="Location (GPS Coordinates)"
                                variant="outlined"
                                value={'lat: ' + sts.gps_latitude + ', lon: ' + sts.gps_longitude}
                                onChange={(e) => setSTS(e.target.value)}
                                error={!!errors.capacity_tonnes}
                                helperText={errors.capacity_tonnes}
                            />
                            <MapComponent onLocationChange={handleLocationChange} />
                            <Button className={classes.button} variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                {loading ? 'Creating...' : 'Create STS'}
                                {loading && <CircularProgress size={20} className={classes.circularProgress} />}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>{dialogType === 'success' ? 'Success' : 'Failure'}</DialogTitle>
                <DialogContent color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateSTSPage;
