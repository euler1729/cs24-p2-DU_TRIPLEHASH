import React, { useState } from 'react';
import { Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Grid, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90vh',
    width: '75vw',
    margin: 'auto',
  },
  title: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
    width: 200,
  },
  table_head: {
    fontWeight: 'bold',
  },
}));

const mockVehicles = [
  { id: 1, plateNumber: 'ABC123', brand: 'Toyota', model: 'Camry' },
  { id: 2, plateNumber: 'XYZ456', brand: 'Honda', model: 'Accord' },
  { id: 3, plateNumber: 'DEF789', brand: 'Ford', model: 'Focus' },
];

const AssignVehicle = () => {
  const classes = useStyles();
  const [filterPlate, setFilterPlate] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');

  const handleAssign = (vehicleId) => {
    console.log('Assigning vehicle with ID:', vehicleId);
    setDialogType('success');
    setDialogMessage('Vehicle Assigned Successfully');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>Assign Vehicle</Typography>
      <TextField
        label="Filter Plate"
        className={classes.textField}
        value={filterPlate}
        onChange={(e) => setFilterPlate(e.target.value)}
        variant="outlined"
      />
      <Paper elevation={3} className={classes.paper}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.table_head}>Plate Number</TableCell>
                <TableCell className={classes.table_head}>Brand</TableCell>
                <TableCell className={classes.table_head}>Model</TableCell>
                <TableCell className={classes.table_head}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.plateNumber}</TableCell>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAssign(vehicle.id)}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === 'success' ? 'Success' : 'Error'}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignVehicle;
