import React, { useState } from 'react';
import { Typography, Grid, Paper, makeStyles, TextField, Button, CircularProgress, MenuItem, FormControl, InputLabel, Select, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        width: '75vw',
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
        marginLeft: theme.spacing(1),
    },
}));

const AssignLandfillManagersPage = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [landfill, setLandfill] = useState('');
    const [managers, setManagers] = useState([]);
    const [assignedManagers, setAssignedManagers] = useState([
        { site: 'Landfill Site 1', manager: 'Manager 1' },
        { site: 'Landfill Site 2', manager: 'Manager 2' },
    ]);

    // Sample data for landfill sites and managers
    const landfillSites = ['Landfill Site 1', 'Landfill Site 2', 'Landfill Site 3'];
    const availableManagers = ['Manager 1', 'Manager 2', 'Manager 3', 'Manager 4'];

    const handleAddManager = () => {
        setManagers([...managers, '']);
    };

    const handleManagerChange = (index, value) => {
        const updatedManagers = [...managers];
        updatedManagers[index] = value;
        setManagers(updatedManagers);
    };

    const handleRemoveManager = (index) => {
        const removedManager = assignedManagers.splice(index, 1)[0];
        setAssignedManagers([...assignedManagers]);
        // Add the removed manager back to the available managers
        availableManagers.push(removedManager.manager);
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
                            Assign Landfill Managers
                        </Typography>
                        <form className={classes.form}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Landfill Site</InputLabel>
                                <Select
                                    value={landfill}
                                    onChange={(e) => setLandfill(e.target.value)}
                                    label="Landfill Site"
                                >
                                    {landfillSites.map((site, index) => (
                                        <MenuItem key={index} value={site}>{site}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {managers.map((manager, index) => (
                                <div key={index}>
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel>Landfill Manager {index + 1}</InputLabel>
                                        <Select
                                            value={manager}
                                            onChange={(e) => handleManagerChange(index, e.target.value)}
                                            label={`Landfill Manager ${index + 1}`}
                                        >
                                            {availableManagers.map((m, i) => (
                                                <MenuItem key={i} value={m}>{m}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            ))}
                            <Button variant="contained" color="primary" onClick={handleAddManager}>Add Manager</Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                                {loading && <CircularProgress size={20} className={classes.circularProgress} />}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" gutterBottom className={classes.title}>
                            Assigned Managers
                        </Typography>
                        <List>
                            {assignedManagers.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={item.manager} secondary={`Assigned to ${item.site}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveManager(index)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default AssignLandfillManagersPage;
