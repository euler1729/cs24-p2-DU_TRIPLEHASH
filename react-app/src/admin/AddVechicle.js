import React, { useState } from 'react';
import { Typography, TextField, Button, Select, MenuItem, Grid, Paper, makeStyles, CircularProgress } from '@material-ui/core';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

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
    const [vehicle, setVehicle] = useState({
        registrationNumber: '',
        type: 'openTruck',
        capacity: '3',
        fuelCostLoaded: '',
        fuelCostUnloaded: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Handle success or error
        }, 2000);
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
                            <TextField name="registrationNumber" className={classes.textField} label="Registration Number" variant="outlined" value={vehicle.registrationNumber} onChange={handleInputChange} />
                            <Select 
                                name="type" 
                                variant="outlined" 
                                value={vehicle.type} 
                                onChange={handleInputChange}
                            >
                                <MenuItem value="openTruck">Open Truck</MenuItem>
                                <MenuItem value="dumpTruck">Dump Truck</MenuItem>
                                <MenuItem value="compactor">Compactor</MenuItem>
                                <MenuItem value="containerCarrier">Container Carrier</MenuItem>
                            </Select>
                            <Select name="capacity" variant="outlined" value={vehicle.capacity} onChange={handleInputChange}>
                                <MenuItem value="3">3 ton</MenuItem>
                                <MenuItem value="5">5 ton</MenuItem>
                                <MenuItem value="7">7 ton</MenuItem>
                            </Select>
                            <TextField name="fuelCostLoaded" className={classes.textField} label="Fuel Cost per Kilometer (Fully Loaded)" variant="outlined" type="number" value={vehicle.fuelCostLoaded} onChange={handleInputChange} />
                            <TextField name="fuelCostUnloaded" className={classes.textField} label="Fuel Cost per Kilometer (Unloaded)" variant="outlined" type="number" value={vehicle.fuelCostUnloaded} onChange={handleInputChange} />
                            <Button className={classes.button} variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                {loading ? 'Creating...' : 'Add Vehicle'}
                                {loading && <CircularProgress size={20} className={classes.circularProgress} />}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default VehiclePage;
