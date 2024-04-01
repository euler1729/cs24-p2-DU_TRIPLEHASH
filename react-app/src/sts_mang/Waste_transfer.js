import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Typography, Button, Table, TableHead, TableBody, TableCell, TableRow, Paper, CircularProgress } from '@material-ui/core';
import api from '../API';

const Fleet = () => {
    const cookies = new Cookies();
    const [stsId, setStsId] = useState(null);
    const [fleetData, setFleetData] = useState(null);
    const [loading, setLoading] = useState(false);

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

    // Function to fetch fleet data
    const fetchFleetData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/sts/fleet?sts_id=${stsId}&total_waste=4`, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            });
            setFleetData(response.data.trips);
        } catch (error) {
            console.error("Error fetching fleet data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle making a trip
    const makeTrip = async (tripId) => {
        try {
            // Implement the logic to make a trip using the tripId
            console.log("Making trip with ID:", tripId);
        } catch (error) {
            console.error("Error making trip:", error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Fleet Information
            </Typography>
            {stsId && <Typography>STS ID: {stsId}</Typography>}
            <Button variant="contained" color="primary" onClick={fetchFleetData} disabled={!stsId || loading}>
                {loading ? 'Loading...' : 'Fetch Fleet Data'}
            </Button>
            {fleetData ? (
                <Paper style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Vehicle ID</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Load</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fleetData.map((trip, index) => (
                                <TableRow key={index}>
                                    <TableCell>{trip.vehicle_id}</TableCell>
                                    <TableCell>{trip.cost}</TableCell>
                                    <TableCell>{trip.load}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => makeTrip(trip.trip_id)}>
                                            Make Trip
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            ) : (
                <Typography>No fleet data available.</Typography>
            )}
        </div>
    );
};

export default Fleet;
