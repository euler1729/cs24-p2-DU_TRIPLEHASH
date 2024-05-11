import React, { useState, useEffect } from 'react';
import {
    Typography, Button, Grid, Paper, makeStyles, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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
    table: {
        minWidth: 650,
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

const ContractorList = () => {
    const classes = useStyles();
    const cookies = new Cookies();
    const [contractors, setContractors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [editContractor, setEditContractor] = useState(null);
    const [deleteContractorId, setDeleteContractorId] = useState(null);

    useEffect(() => {
        fetchContractors();
    }, []);

    const fetchContractors = async () => {
        setLoading(true);
        try {
            const response = await api.get('contractor/register', {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            });
            console.log(response.data)
            setContractors(response.data.contractors);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setDialogType('error');
            setDialogMessage('Failed to fetch contractors');
            setDialogOpen(true);
        }
    };

    const handleEdit = (contractor) => {
        setEditContractor(contractor);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/contractors/${deleteContractorId}`, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            });
            setDeleteContractorId(null);
            fetchContractors();
            setLoading(false);
            setDialogType('success');
            setDialogMessage('Contractor deleted successfully');
            setDialogOpen(true);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setDialogType('error');
            setDialogMessage('Failed to delete contractor');
            setDialogOpen(true);
        }
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h5" gutterBottom className={classes.title}>
                            Contractors List
                        </Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <TableContainer>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Company Name</TableCell>
                                            <TableCell>Contract ID</TableCell>
                                            <TableCell>Contact Number</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {contractors.map((contractor) => (
                                            <TableRow key={contractor.contract_id}>
                                                <TableCell>{contractor.company_name}</TableCell>
                                                <TableCell>{contractor.contract_id}</TableCell>
                                                <TableCell>{contractor.contact_num}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleEdit(contractor)} className={classes.button}>Edit</Button>
                                                    <Button onClick={() => setDeleteContractorId(contractor.contract_id)} className={classes.button} color="secondary">Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
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
            <Dialog open={Boolean(deleteContractorId)} onClose={() => setDeleteContractorId(null)}>
                <DialogTitle>Delete Contractor</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this contractor?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteContractorId(null)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ContractorList;
