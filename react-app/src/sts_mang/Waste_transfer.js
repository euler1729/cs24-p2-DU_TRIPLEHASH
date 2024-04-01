import React, { useState } from 'react';
import { Typography, Button, Paper, CircularProgress, TextField, makeStyles } from '@material-ui/core';
import api from '../API';
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(2),
        maxWidth: 400,
    },
    textField: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

const WasteTransfer = () => {
    const classes = useStyles();
    const [vehicleRegNo, setVehicleRegNo] = useState('');
    const [load, setLoad] = useState('');
    const [landfill, setLandfill] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [makingTrip, setMakingTrip] = useState(false);
    const [tripCost, setTripCost] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setMakingTrip(true); // Set makingTrip state to true while processing the submission
        try {
            const response = await api.post('/maketrip', {
                sts_id: 1,
                vehicle_id: 1,
                load: load,
                cost: tripCost,
            }, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setTripCost(response.data.cost);
            setError(null); // Reset error state if request is successful
        } catch (error) {
            console.error("Error making trip:", error);
            setError("Error making trip. Please try again."); // Set error message
        } finally {
            setMakingTrip(false); // Reset makingTrip state after processing
        }
    };

    return (
        <div className={classes.container}>
            <Typography variant="h4" gutterBottom>
                Waste Transfer
            </Typography>
            <Paper className={classes.paper}>
                <TextField
                    className={classes.textField}
                    label="Vehicle Registration Number"
                    variant="outlined"
                    value={vehicleRegNo}
                    onChange={(e) => setVehicleRegNo(e.target.value)}
                />
                <TextField
                    className={classes.textField}
                    label="Load"
                    variant="outlined"
                    value={load}
                    onChange={(e) => setLoad(e.target.value)}
                />
                <TextField
                    className={classes.textField}
                    label="Landfill"
                    variant="outlined"
                    value={landfill}
                    onChange={(e) => setLandfill(e.target.value)}
                />
                <TextField
                    className={classes.textField}
                    label="Schedule Time"
                    variant="outlined"
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                />
            </Paper>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={makingTrip}
                className={classes.button}
            >
                {makingTrip ? 'Making Trip...' : 'Make Trip'}
            </Button>
            {makingTrip && <CircularProgress className={classes.textField} />}
            {error && (
                <Paper className={classes.paper}>
                    <Typography color="error" gutterBottom>
                        {error}
                    </Typography>
                </Paper>
            )}
            {tripCost !== '' && (
                <Paper className={classes.paper}>
                    <Typography variant="h6" gutterBottom>
                        Trip Cost
                    </Typography>
                    <Typography><strong>Cost:</strong> {tripCost}</Typography>
                </Paper>
            )}
        </div>
    );
};

export default WasteTransfer;
