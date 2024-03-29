import React, { useState } from 'react';
import { Typography, TextField, Button, Select, MenuItem, Grid, Paper, makeStyles, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';
import Cookies from 'universal-cookie';

// API
import api from '../API';

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
    outlinedSelect: {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: EcoSyncBrand.Colors.green, // Change to green color
            },
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

const VehiclePage = () => {
    const classes = useStyles();
    const cookies = new Cookies();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [vehicle, setVehicle] = useState({
        vehicle_reg_number: '',
        vehicle_type: 'openTruck',
        vehicle_capacity_in_ton: '3',
        fuel_cost_per_km_loaded: '',
        fuel_cost_per_km_unloaded: '',
    });
    const [initVehicle, setInitVehicle] = useState(vehicle);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        // Clear previous errors
        setErrors({});

        // Validate inputs
        const newErrors = {};
        if (!vehicle.vehicle_reg_number) {
            newErrors.vehicle_reg_number = 'Registration Number is required';
        }
        if (!vehicle.fuel_cost_per_km_loaded) {
            newErrors.fuel_cost_per_km_loaded = 'Fuel Cost (Fully Loaded) is required';
        } else if (isNaN(vehicle.fuel_cost_per_km_loaded) || vehicle.fuel_cost_per_km_loaded <= 0) {
            newErrors.fuel_cost_per_km_loaded = 'Fuel Cost (Fully Loaded) must be a positive number';
        }
        if (!vehicle.fuel_cost_per_km_unloaded) {
            newErrors.fuel_cost_per_km_unloaded = 'Fuel Cost (Unloaded) is required';
        } else if (isNaN(vehicle.fuel_cost_per_km_unloaded) || vehicle.fuel_cost_per_km_unloaded <= 0) {
            newErrors.fuel_cost_per_km_unloaded = 'Fuel Cost (Unloaded) must be a positive number';
        }

        // Set errors if any
        setErrors(newErrors);

        // If there are errors, prevent form submission
        if (Object.keys(newErrors).length > 0) {
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        // Proceed with form submission
        setLoading(true);

        try {
            api.post('/data-entry/add-vehicle', vehicle, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            }).then((response) => {
                setDialogType('success');
                setDialogMessage('Vehicle added successfully');
                setDialogOpen(true);
                setLoading(false);
                setVehicle(initVehicle);
            }).catch((error) => {
                setDialogType('error');
                setDialogMessage('Failed to add vehicle');
                setDialogOpen(true);
                setLoading(false);
            });
        } catch (error) {
            setDialogType('error');
            setDialogMessage('Failed to add vehicle');
            setDialogOpen(true);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name === 'fuel_cost_per_km_loaded' || name === 'fuel_cost_per_km_unloaded') {
            if (isNaN(value) || value < 0) {
                return;
            }
        }
        setVehicle({ ...vehicle, [name]: value });
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h5" gutterBottom className={classes.title}>
                            Add New Vehicle
                        </Typography>
                        <form className={classes.form}>
                            <TextField
                                name="vehicle_reg_number"
                                className={classes.textField}
                                label="Registration Number"
                                variant="outlined"
                                error={!!errors.vehicle_reg_number}
                                helperText={errors.vehicle_reg_number}
                                value={vehicle.vehicle_reg_number}
                                onChange={handleInputChange}
                            />
                            <Select
                                name="type"
                                variant="outlined"
                                error={!!errors.vehicle_type}
                                helperText={errors.vehicle_type}
                                value={vehicle.vehicle_type}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="openTruck">Open Truck</MenuItem>
                                <MenuItem value="dumpTruck">Dump Truck</MenuItem>
                                <MenuItem value="compactor">Compactor</MenuItem>
                                <MenuItem value="containerCarrier">Container Carrier</MenuItem>
                            </Select>
                            <Select
                                name="vehicle_capacity_in_ton"
                                variant="outlined"
                                error={!!errors.vehicle_capacity_in_ton}
                                helperText={errors.vehicle_capacity_in_ton}
                                value={vehicle.vehicle_capacity_in_ton}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={3}>3 ton</MenuItem>
                                <MenuItem value={5}>5 ton</MenuItem>
                                <MenuItem value={7}>7 ton</MenuItem>
                                <MenuItem value={15}>15 ton</MenuItem>
                            </Select>
                            <TextField
                                name="fuel_cost_per_km_loaded"
                                className={classes.textField}
                                label="Fuel Cost per Kilometer (Fully Loaded)"
                                variant="outlined"
                                type="number"
                                error={!!errors.fuel_cost_per_km_loaded}
                                helperText={errors.fuel_cost_per_km_loaded}
                                value={vehicle.fuel_cost_per_km_loaded} onChange={handleInputChange} />
                            <TextField
                                name="fuel_cost_per_km_unloaded"
                                className={classes.textField}
                                label="Fuel Cost per Kilometer (Unloaded)"
                                variant="outlined"
                                type="number"
                                error={!!errors.fuel_cost_per_km_unloaded}
                                helperText={errors.fuel_cost_per_km_unloaded}
                                value={vehicle.fuel_cost_per_km_unloaded}
                                onChange={handleInputChange} />
                            <Button className={classes.button} variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                {loading ? 'Creating...' : 'Add Vehicle'}
                                {loading && <CircularProgress size={20} className={classes.circularProgress} />}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>{dialogType === 'success' ? 'Success' : 'Failure'}</DialogTitle>
                <DialogContent color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default VehiclePage;
