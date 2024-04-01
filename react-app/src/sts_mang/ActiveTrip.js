import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Typography, Button, Table, TableHead, TableBody, TableCell, TableRow, Paper, CircularProgress, FormControl, Select, MenuItem, TextField, makeStyles } from '@material-ui/core';
import api from '../API';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center items horizontally
        marginBottom: theme.spacing(2),
    },
    formControl: {
        marginRight: theme.spacing(2),
    },
    textField: {
        width: 200,
        marginRight: theme.spacing(2),
    },
    root: {
        height: '90vh',
        width: '75vw',
        margin: 'auto',
    },
    title: {
        color: EcoSyncBrand.Colors.green,
        fontWeight: 'bold',
        marginBottom: theme.spacing(2),
    },
    paper: {
        width: '100%',
    },
}));

const ActiveTrips = () => {
    const cookies = new Cookies();
    const classes = useStyles();
    const [activeTrips, setActiveTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stsId, setStsId] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all'); // State to store filter status
    const [startDate, setStartDate] = useState(''); // State to store start date filter
    const [endDate, setEndDate] = useState(''); // State to store end date filter
    const [vehicleId, setVehicleId] = useState(''); // State to store vehicle ID filter

    useEffect(() => {
        // Function to fetch STS ID
        const fetchStsId = async () => {
            try {
                const response = await api.get('/sts', {
                    headers: {
                        "Authorization": `Bearer ${cookies.get('access_token')}`,
                    },
                    withCredentials: true
                });
                setStsId(response.data.sts_id);
            } catch (error) {
                console.error("Error fetching STS ID:", error);
            }
        };

        // Fetch STS ID
        fetchStsId();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    useEffect(() => {
        const fetchActiveTrips = async () => {
            try {
                setLoading(true);
                const response = await api.get('/trip', {
                    params: {
                        sts_id: stsId,
                        vehicle_id: vehicleId,
                        start_date: startDate,
                        end_date: endDate,
                    },
                    headers: {
                        "Authorization": `Bearer ${cookies.get('access_token')}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                setActiveTrips(response.data.trips);
            } catch (error) {
                console.error("Error fetching active trips:", error);
            } finally {
                setLoading(false);
            }
        };

        if (stsId) {
            fetchActiveTrips();
        }
    }, [stsId, vehicleId, startDate, endDate]);

    // Function to get the status based on trip properties
    const getStatus = (trip) => {
        if (!trip.dump_time) {
            return "To Landfill";
        } else if (!trip.end_time) {
            return "Active";
        } else {
            return "Completed";
        }
    };

    // Function to handle filter change
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    // Function to handle start date change
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    // Function to handle end date change
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    // Function to handle vehicle ID change
    const handleVehicleIdChange = (event) => {
        setVehicleId(event.target.value);
    };

    // Function to filter trips based on status and date range
    const filterTrips = (trips) => {
        return trips.filter(trip => {
            const status = getStatus(trip);
            const startDateMatch = !startDate || new Date(trip.start_time) >= new Date(startDate);
            const endDateMatch = !endDate || new Date(trip.start_time) <= new Date(endDate);
            const statusMatch = filterStatus === 'all' || status === filterStatus;
            return startDateMatch && endDateMatch && statusMatch;
        });
    };

    // Check if all STS IDs are the same
    const isSameStsId = activeTrips.every(trip => trip.sts_id === activeTrips[0].sts_id);

    return (
        <div className={classes.root}>
            <Typography variant="h4" gutterBottom>
                Active Trips Information
            </Typography>
            <div className={classes.filterContainer}>
                <FormControl className={classes.formControl}>
                    <Select
                        value={filterStatus}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>
                {(!stsId || isSameStsId) && ( // Conditionally render based on stsId availability and whether all sts_id values are the same
                    <TextField
                        className={classes.textField}
                        label="STS ID"
                        type="text"
                        value={stsId}
                        InputProps={{
                            readOnly: true, // Make the input read-only if stsId is available
                        }}
                    />
                )}
                <                TextField
                    className={classes.textField}
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    className={classes.textField}
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    className={classes.textField}
                    label="Vehicle ID"
                    type="text"
                    value={vehicleId}
                    onChange={handleVehicleIdChange}
                />
            </div>
            {loading ? (
                <CircularProgress />
            ) : (
                <Paper className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Trip ID</TableCell>
                                <TableCell>Vehicle ID</TableCell>
                                {!isSameStsId && <TableCell>STS ID</TableCell>} {/* Conditionally render based on whether all sts_id values are the same */}
                                <TableCell>Status</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Load</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterTrips(activeTrips).map((trip, index) => (
                                <TableRow key={index}>
                                    <TableCell>{trip.trip_id}</TableCell>
                                    <TableCell>{trip.vehicle_id}</TableCell>
                                    {!isSameStsId && <TableCell>{trip.sts_id}</TableCell>} {/* Conditionally render based on whether all sts_id values are the same */}
                                    <TableCell>{getStatus(trip)}</TableCell>
                                    <TableCell>{trip.cost}</TableCell>
                                    <TableCell>{trip.load}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </div>
    );
};

export default ActiveTrips;

