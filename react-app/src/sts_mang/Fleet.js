import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Typography, Button, Table, TableHead, TableBody, TableCell, TableRow, Paper, CircularProgress, useTheme, Tab, TextField } from '@material-ui/core';
import api from '../API';

const Fleet = () => {
    const cookies = new Cookies();
    const [stsId, setStsId] = useState(null);
    const [fleetData, setFleetData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stsWaste, setStsWaste] = useState(null);
    const [total_waste, setTotalWaste] = useState(null);
    const [numberOfTruck, setNumberOfTruck] = useState(null);
    const [total_cost, setTotalCost] = useState(null);

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
                setStsWaste(response.data.waste);
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
            const response = await api.get(`/sts/fleet?sts_id=${stsId}&total_waste=${stsWaste}`, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            });
            setFleetData(response.data.trips);
            setTotalWaste(response.data.total_waste);
            setNumberOfTruck(response.data.total_vehicles);
            setTotalCost(response.data.total_cost)
            console.log(fleetData)
        } catch (error) {
            console.error("Error fetching fleet data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle making a trip
    const makeTrip = async (trip) => {
        try {
            const response = await api.post('/maketrip', {
                sts_id: stsId,
                vehicle_id: trip.vehicle_id,
                load: trip.load,
                cost: trip.cost,
            }, {
                headers: {
                    'Authorization': `Bearer ${cookies.get('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            // Assuming fleetData is an array of trips
            // Remove the trip from fleetData after a successful trip
            setFleetData(prevFleetData => prevFleetData.filter(item => item !== trip));
            setTotalCost(Math.round(total_cost - trip.cost, 2))
    
            console.log(response.data);
        } catch (error) {
            console.error("Error making trip:", error);
        }
    };
    
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Fleet Information
            </Typography>
            {stsId && <Typography>Waste Remaning: {stsWaste}</Typography>}
            <Typography>Waste to be transfer</Typography>
            <TextField variant='outlined' type="number" value={stsWaste} onChange={(e) => setStsWaste(e.target.value)} />
            <Button variant="contained" color="primary" onClick={fetchFleetData} disabled={!stsId || loading}>
                {loading ? 'Loading...' : 'Fetch Fleet Data'}
            </Button>
            {total_waste && <Typography> Maximum waste can be transfer: {total_waste} TON</Typography>}
            {numberOfTruck && <Typography> Vehicle needed in this fleet: {numberOfTruck} </Typography>}
            {total_waste && <Typography>Total cost of this fleet: {total_cost}</Typography>}
            {numberOfTruck && <Typography>Assign the truck below in order to achieve minimum cost</Typography>}
            
            
            
            {fleetData ? (
                <Paper style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Vehicle ID</TableCell>
                                <TableCell>Cost</TableCell>
                                <TableCell>Load</TableCell>
                                <TableCell>Trip Number</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fleetData.map((trip, index) => (
                                <TableRow key={index}>
                                    <TableCell>{trip.vehicle_id}</TableCell>
                                    <TableCell>{trip.cost}</TableCell>
                                    <TableCell>{trip.load}</TableCell>
                                    <TableCell>{trip.trip_number}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => makeTrip(trip)}>
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
