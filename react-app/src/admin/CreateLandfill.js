import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, Paper, makeStyles, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import api from '../API';
import MapComponent from '../components/MapComponent';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        width: '75vw',
        margin: 'auto',
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
    createLandfillPage: {
        width: '80%', // Set the width to 80% of AdminDashboard
        maxHeight: '100%', // Ensure that the component doesn't overflow the window size
        overflow: 'auto', // Add scroll if the content overflows
    },
}));



const CreateLandfill = () => {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [landfill, setlandfill] = useState({
        site_name: '',
        capacity: '',
        operational_timespan: "2024-04-01 to 2024-04-30",
        gps_longitude: 90.4338,
        gps_latitude: 23.7191,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = () => {
        setErrors({});

        const newErrors = {};
        if (!landfill.site_name) {
            newErrors.site_name = 'Site Name is Required';
        }
        if (!landfill.capacity) {
            newErrors.capacity = 'capacity is required';
        } else if (isNaN(landfill.capacity) || landfill.capacity <= 0) {
            newErrors.capacity = 'capacity must be a positive number';
        }
        if (!landfill.gps_longitude) {
            newErrors.gps_longitude = 'GPS Coordinates are required';
        }
        if (!landfill.gps_latitude) {
            newErrors.gps_latitude = 'GPS Coordinates are required';
        }
        if (!startDate) {
            newErrors.startDate = 'Start Date is required';
        }
        if (!endDate) {
            newErrors.endDate = 'End Date is required';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            api.post('/data-entry/create-landfill-site', landfill)
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    setDialogType('success');
                    setDialogMessage('landfill created successfully');
                    setDialogOpen(true);
                    setlandfill({
                        site_name: '',
                        capacity: '',
                        operational_timespan: `${startDate} to ${endDate}`,
                        gps_longitude: 90.4338,
                        gps_latitude: 23.7191,
                    });
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setDialogType('error');
                    setDialogMessage('Failed to create landfill');
                    setDialogOpen(true);
                });

        } catch (err) {
            console.log(err);
            setLoading(false);
            setDialogType('error');
            setDialogMessage('Failed to create landfill');
            setDialogOpen(true);
        }
    };

    const handleLocationChange = (coords) => {
        console.log(coords)
        const lat = parseFloat(coords?.lat).toFixed(2);
        const lng = parseFloat(coords?.lng).toFixed(2);
        setlandfill({ ...landfill, gps_latitude: lat, gps_longitude: lng });
    };
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    return (
        <div className={classes.root}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h5" gutterBottom className={classes.title}>
                            Create New Landfill
                        </Typography>
                        <form className={classes.form}>
                            <TextField
                                name="site_name"
                                className={classes.textField}
                                label="Site Name"
                                variant="outlined"
                                value={landfill.site_name}
                                onChange={(e) => setlandfill({ ...landfill, site_name: e.target.value })}
                                error={!!errors.site_name}
                                helperText={errors.site_name}
                            />
                            <TextField
                                name="capacity"
                                className={classes.textField}
                                label="Capacity (in tonnes)"
                                variant="outlined"
                                type="number"
                                value={landfill.capacity}
                                onChange={(e) => setlandfill({ ...landfill, capacity: e.target.value })}
                                error={!!errors.capacity}
                                helperText={errors.capacity}
                            />
                            {/* <Grid container spacing={2} style={{border:2}}> */}
                            {/* <Grid item xs={5}> */}
                            <TextField
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* </Grid> */}
                            {/* <Grid item xs={5}> */}
                            <TextField
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* </Grid> */}
                            {/* </Grid> */}
                            <TextField
                                name="location"
                                className={classes.textField}
                                label="Location (GPS Coordinates)"
                                variant="outlined"
                                value={'lat: ' + landfill.gps_latitude + ', lon: ' + landfill.gps_longitude}
                                onChange={(e) => setlandfill(e.target.value)}
                                error={!!errors.capacity}
                                helperText={errors.capacity}
                            />
                            <MapComponent onLocationChange={handleLocationChange} />
                            <Button className={classes.button} variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                {loading ? 'Creating...' : 'Create landfill'}
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

export default CreateLandfill;
