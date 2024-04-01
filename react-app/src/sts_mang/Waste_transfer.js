import React, { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(false);
    const [makingTrip, setMakingTrip] = useState(false);
    const [tripCost, setTripCost] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMakingTrip(true);
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
        }
        catch (error) {
            
            console.error("Error making trip:", error);
        }
        finally {
            setMakingTrip(false);
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
