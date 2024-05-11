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

const ContractorRegistration = () => {
    const classes = useStyles();
    const cookies = new Cookies();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [contractor, setContractor] = useState({
        company_name: '',
        contract_id: '',
        reg_id: '',
        registration_date: '',
        tin: '',
        contact_number: '',
        workforce_size: '',
        payment_per_ton: '',
        required_waste_per_day: '',
        contract_duration: '',
        area_of_collection: '',
        designated_sts: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        setErrors({});

        const newErrors = {};
        if (!contractor.company_name) newErrors.company_name = 'Company Name is required';
        if (!contractor.contract_id) newErrors.contract_id = 'Contract ID is required';
        if (!contractor.reg_id) newErrors.reg_id = 'Registration ID is required';
        if (!contractor.registration_date) newErrors.registration_date = 'Registration Date is required';
        if (!contractor.tin) newErrors.tin = 'TIN is required';
        if (!contractor.contact_number) newErrors.contact_number = 'Contact Number is required';
        if (!contractor.workforce_size) newErrors.workforce_size = 'Workforce Size is required';
        if (!contractor.payment_per_ton) newErrors.payment_per_ton = 'Payment per Tonnage is required';
        if (!contractor.required_waste_per_day) newErrors.required_waste_per_day = 'Required Waste per Day is required';
        if (!contractor.contract_duration) newErrors.contract_duration = 'Contract Duration is required';
        if (!contractor.area_of_collection) newErrors.area_of_collection = 'Area of Collection is required';
        if (!contractor.designated_sts) newErrors.designated_sts = 'Designated STS is required';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            api.post('/contractor/register', contractor, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            })
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    setDialogType('success');
                    setDialogMessage('Contractor registered successfully');
                    setDialogOpen(true);
                    setContractor({
                        company_name: '',
                        contract_id: '',
                        reg_id: '',
                        registration_date: '',
                        tin: '',
                        contact_number: '',
                        workforce_size: '',
                        payment_per_ton: '',
                        required_waste_per_day: '',
                        contract_duration: '',
                        area_of_collection: '',
                        designated_sts: '',
                    });
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setDialogType('error');
                    setDialogMessage(err?.response?.data?.error || 'Failed to register contractor');
                    setDialogOpen(true);
                });

        } catch (err) {
            console.log(err);
            setLoading(false);
            setDialogType('error');
            setDialogMessage('Failed to register contractor');
            setDialogOpen(true);
        }
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h5" gutterBottom className={classes.title}>
                            Register New Contractor
                        </Typography>
                        <form className={classes.form}>
                            <TextField
                                name="company_name"
                                className={classes.textField}
                                label="Company Name"
                                variant="outlined"
                                value={contractor.company_name}
                                onChange={(e) => setContractor({ ...contractor, company_name: e.target.value })}
                                error={!!errors.company_name}
                                helperText={errors.company_name}
                            />
                            <TextField
                                name="contract_id"
                                className={classes.textField}
                                label="Contract ID"
                                variant="outlined"
                                value={contractor.contract_id}
                                onChange={(e) => setContractor({ ...contractor, contract_id: e.target.value })}
                                error={!!errors.contract_id}
                                helperText={errors.contract_id}
                            />
                            <TextField
                                name="reg_id"
                                className={classes.textField}
                                label="Registration ID"
                                variant="outlined"
                                value={contractor.reg_id}
                                onChange={(e) => setContractor({ ...contractor, reg_id: e.target.value })}
                                error={!!errors.reg_id}
                                helperText={errors.reg_id}
                            />
                            <TextField
                                name="registration_date"
                                className={classes.textField}
                                label="Registration Date"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={contractor.registration_date}
                                onChange={(e) => setContractor({ ...contractor, registration_date: e.target.value })}
                                error={!!errors.registration_date}
                                helperText={errors.registration_date}
                            />
                            <TextField
                                name="tin"
                                className={classes.textField}
                                label="TIN"
                                variant="outlined"
                                value={contractor.tin}
                                onChange={(e) => setContractor({ ...contractor, tin: e.target.value })}
                                error={!!errors.tin}
                                helperText={errors.tin}
                            />
                            <TextField
                                name="contact_number"
                                className={classes.textField}
                                label="Contact Number"
                                variant="outlined"
                                value={contractor.contact_number}
                                onChange={(e) => setContractor({ ...contractor, contact_number: e.target.value })}
                                error={!!errors.contact_number}
                                helperText={errors.contact_number}
                            />
                            <TextField
                                name="workforce_size"
                                className={classes.textField}
                                label="Workforce Size"
                                variant="outlined"
                                type="number"
                                value={contractor.workforce_size}
                                onChange={(e) => setContractor({ ...contractor, workforce_size: e.target.value })}
                                error={!!errors.workforce_size}
                                helperText={errors.workforce_size}
                            />
                            <TextField
                                name="payment_per_ton"
                                className={classes.textField}
                                label="Payment per Tonnage of Waste"
                                variant="outlined"
                                type="number"
                                value={contractor.payment_per_ton}
                                onChange={(e) => setContractor({ ...contractor, payment_per_ton: e.target.value })}
                                error={!!errors.payment_per_ton}
                                helperText={errors.payment_per_ton}
                            />
                            <TextField
                                name="required_waste_per_day"
                                className={classes.textField}
                                label="Required Waste per Day"
                                variant="outlined"
                                type="number"
                                value={contractor.required_waste_per_day}
                                onChange={(e) => setContractor({ ...contractor, required_waste_per_day: e.target.value })}
                                error={!!errors.required_waste_per_day}
                                helperText={errors.required_waste_per_day}
                            />
                            <TextField
                                name="contract_duration"
                                className={classes.textField}
                                label="Contract Duration"
                                variant="outlined"
                                value={contractor.contract_duration}
                                onChange={(e) => setContractor({ ...contractor, contract_duration: e.target.value })}
                                error={!!errors.contract_duration}
                                helperText={errors.contract_duration}
                            />
                            <TextField
                                name="area_of_collection"
                                className={classes.textField}
                                label="Area of Collection"
                                variant="outlined"
                                value={contractor.area_of_collection}
                                onChange={(e) => setContractor({ ...contractor, area_of_collection: e.target.value })}
                                error={!!errors.area_of_collection}
                                helperText={errors.area_of_collection}
                            />
                            <TextField
                                name="designated_sts"
                                className={classes.textField}
                                label="Designated STS"
                                variant="outlined"
                                value={contractor.designated_sts}
                                onChange={(e) => setContractor({ ...contractor, designated_sts: e.target.value })}
                                error={!!errors.designated_sts}
                                helperText={errors.designated_sts}
                            />
                            <Button className={classes.button} variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                {loading ? 'Registering...' : 'Register Contractor'}
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

export default ContractorRegistration;
