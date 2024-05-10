import React, { useState } from 'react';
import {
    Typography, TextField, Button, Grid, Paper, makeStyles, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@material-ui/core';
import api from '../API';
import Cookies from 'universal-cookie';
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
            borderColor: EcoSyncBrand.Colors.green,
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: EcoSyncBrand.Colors.green,
        },
    },
    button: {
        marginTop: theme.spacing(2),
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

const ContractorManagerCreation = () => {
    const classes = useStyles();
    const cookies = new Cookies();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [manager, setManager] = useState({
        full_name: '',
        user_id: '',
        email: '',
        account_creation_date: '',
        contact_number: '',
        assigned_contractor_company: '',
        access_level: '',
        username: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        setErrors({});

        const newErrors = {};
        if (!manager.full_name) newErrors.full_name = 'Full Name is required';
        if (!manager.user_id) newErrors.user_id = 'User ID is required';
        if (!manager.email) newErrors.email = 'Email Address is required';
        if (!manager.account_creation_date) newErrors.account_creation_date = 'Date of Account Creation is required';
        if (!manager.contact_number) newErrors.contact_number = 'Contact Number is required';
        if (!manager.assigned_contractor_company) newErrors.assigned_contractor_company = 'Assigned Contractor Company is required';
        if (!manager.access_level) newErrors.access_level = 'Access Level is required';
        if (!manager.username) newErrors.username = 'Username is required';
        if (!manager.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            api.post('/contractor-managers/create', manager, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            })
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    setDialogType('success');
                    setDialogMessage('Contractor Manager created successfully');
                    setDialogOpen(true);
                    setManager({
                        full_name: '',
                        user_id: '',
                        email: '',
                        account_creation_date: '',
                        contact_number: '',
                        assigned_contractor_company: '',
                        access_level: '',
                        username: '',
                        password: '',
                    });
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setDialogType('error');
                    setDialogMessage(err?.response?.data?.error || 'Failed to create Contractor Manager');
                    setDialogOpen(true);
                });

        } catch (err) {
            console.log(err);
            setLoading(false);
            setDialogType('error');
            setDialogMessage('Failed to create Contractor Manager');
            setDialogOpen(true);
        }
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h5" gutterBottom className={classes.title}>
                            Create Contractor Manager
                        </Typography>
                        <form className={classes.form}>
                            <TextField
                                name="full_name"
                                className={classes.textField}
                                label="Full Name"
                                variant="outlined"
                                value={manager.full_name}
                                onChange={(e) => setManager({ ...manager, full_name: e.target.value })}
                                error={!!errors.full_name}
                                helperText={errors.full_name}
                            />
                            <TextField
                                name="user_id"
                                className={classes.textField}
                                label="User ID"
                                variant="outlined"
                                value={manager.user_id}
                                onChange={(e) => setManager({ ...manager, user_id: e.target.value })}
                                error={!!errors.user_id}
                                helperText={errors.user_id}
                            />
                            <TextField
                                name="email"
                                className={classes.textField}
                                label="Email Address"
                                variant="outlined"
                                type="email"
                                value={manager.email}
                                onChange={(e) => setManager({ ...manager, email: e.target.value })}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                name="account_creation_date"
                                className={classes.textField}
                                label="Date of Account Creation"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={manager.account_creation_date}
                                onChange={(e) => setManager({ ...manager, account_creation_date: e.target.value })}
                                error={!!errors.account_creation_date}
                                helperText={errors.account_creation_date}
                            />
                            <TextField
                                name="contact_number"
                                className={classes.textField}
                                label="Contact Number"
                                variant="outlined"
                                value={manager.contact_number}
                                onChange={(e) => setManager({ ...manager, contact_number: e.target.value })}
                                error={!!errors.contact_number}
                                helperText={errors.contact_number}
                            />
                            <TextField
                                name="assigned_contractor_company"
                                className={classes.textField}
                                label="Assigned Contractor Company"
                                variant="outlined"
                                value={manager.assigned_contractor_company}
                                onChange={(e) => setManager({ ...manager, assigned_contractor_company: e.target.value })}
                                error={!!errors.assigned_contractor_company}
                                helperText={errors.assigned_contractor_company}
                            />
                            <TextField
                                name="access_level"
                                className={classes.textField}
                                label="Access Level"
                                variant="outlined"
                                value={manager.access_level}
                                onChange={(e) => setManager({ ...manager, access_level: e.target.value })}
                                error={!!errors.access_level}
                                helperText={errors.access_level}
                            />
                            <TextField
                                name="username"
                                className={classes.textField}
                                label="Username"
                                variant="outlined"
                                value={manager.username}
                                onChange={(e) => setManager({ ...manager, username: e.target.value })}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                            <TextField
                                name="password"
                                className={classes.textField}
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={manager.password}
                                onChange={(e) => setManager({ ...manager, password: e.target.value })}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <Button className={classes.button} variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                {loading ? 'Creating...' : 'Create Contractor Manager'}
                                {loading && <CircularProgress size={20} className={classes.circularProgress} />}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                    {dialogType === 'success' ? 'Success' : 'Failure'}
                </DialogTitle>
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

export default ContractorManagerCreation;
