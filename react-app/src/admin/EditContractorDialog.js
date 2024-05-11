import React, { useState, useEffect } from 'react';
import {
    Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, makeStyles
} from '@material-ui/core';
import api from '../API';
import Cookies from 'universal-cookie';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const useStyles = makeStyles((theme) => ({
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
}));

const EditContractorDialog = ({ open, onClose, contractor, onSave }) => {
    const classes = useStyles();
    const cookies = new Cookies();
    const [formData, setFormData] = useState(contractor);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(contractor);
    }, [contractor]);

    const handleSubmit = async () => {
        setErrors({});
        const newErrors = {};
        if (!formData.company_name) newErrors.company_name = 'Company Name is required';
        if (!formData.contract_id) newErrors.contract_id = 'Contract ID is required';
        if (!formData.contact_number) newErrors.contact_number = 'Contact Number is required';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            await api.put(`/contractors/${formData.contract_id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            });
            setLoading(false);
            onSave();
        } catch (error) {
            console.error(error);
            setLoading(false);
            setErrors({ submit: 'Failed to update contractor' });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Contractor</DialogTitle>
            <DialogContent>
                <form className={classes.form}>
                    <TextField
                        name="company_name"
                        className={classes.textField}
                        label="Company Name"
                        variant="outlined"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        error={!!errors.company_name}
                        helperText={errors.company_name}
                    />
                    <TextField
                        name="contract_id"
                        className={classes.textField}
                        label="Contract ID"
                        variant="outlined"
                        value={formData.contract_id}
                        onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })}
                        error={!!errors.contract_id}
                        helperText={errors.contract_id}
                    />
                    <TextField
                        name="contact_number"
                        className={classes.textField}
                        label="Contact Number"
                        variant="outlined"
                        value={formData.contact_number}
                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                        error={!!errors.contact_number}
                        helperText={errors.contact_number}
                    />
                    {errors.submit && (
                        <Typography color="error">{errors.submit}</Typography>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditContractorDialog;
