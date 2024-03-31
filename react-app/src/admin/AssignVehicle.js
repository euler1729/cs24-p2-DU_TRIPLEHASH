import React, { useState } from 'react';
import { Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

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
    margin: theme.spacing(2),
    color: EcoSyncBrand.Colors.green,
    backgroundColor: EcoSyncBrand.Colors.greenWhite,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: EcoSyncBrand.Colors.green, // Green color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: EcoSyncBrand.Colors.green, // Green color
    },
    width: '200px',
  },
  table_head: {
    fontWeight: 'bold',
  },
}));

const mockVehicles = [
  { id: 1, plateNumber: 'ABC123', arrivalTime: '2024-03-30T09:00', departureTime: '2024-03-30T17:00', wasteAmount: '10' },
  { id: 2, plateNumber: 'XYZ456', arrivalTime: '2024-03-30T10:00', departureTime: '2024-03-30T16:00', wasteAmount: '8' },
  { id: 3, plateNumber: 'DEF789', arrivalTime: '2024-03-30T11:00', departureTime: '2024-03-30T15:00', wasteAmount: '6' },
];

const AssignVehicle = () => {
  const classes = useStyles();
  const [filterPlate, setFilterPlate] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleAssign = () => {
    if (!selectedVehicle) {
      setDialogType('error');
      setDialogMessage('Please select a vehicle');
      setDialogOpen(true);
      return;
    }
    // Perform assignment action here
    setDialogType('success');
    setDialogMessage('Vehicle Entry Added Successfully');
    setDialogOpen(true);
    // Reset fields after assignment
    setSelectedVehicle(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditRow = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSaveRow = () => {
    // Save edited row logic here
    setSelectedVehicle(null); // Reset selected vehicle after saving
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>Vehicle Entry</Typography>
      <div style={{ marginTop: '20px' }}>
        <TextField
          label="Registration Number"
          select
          className={classes.textField}
          value={selectedVehicle ? selectedVehicle.plateNumber : ''}
          onChange={(e) => setSelectedVehicle(mockVehicles.find(vehicle => vehicle.plateNumber === e.target.value))}
          variant="outlined"
        >
          {mockVehicles.map((vehicle) => (
            <MenuItem key={vehicle.id} value={vehicle.plateNumber}>
              {vehicle.plateNumber}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Arrival Time"
          className={classes.textField}
          type="datetime-local"
          value={selectedVehicle ? selectedVehicle.arrivalTime : ''}
          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, arrivalTime: e.target.value })}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Departure Time"
          className={classes.textField}
          type="datetime-local"
          value={selectedVehicle ? selectedVehicle.departureTime : ''}
          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, departureTime: e.target.value })}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Waste Amount"
          className={classes.textField}
          value={selectedVehicle ? selectedVehicle.wasteAmount : ''}
          onChange={(e) => setSelectedVehicle({ ...selectedVehicle, wasteAmount: e.target.value })}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssign}
          style={{ margin: '20px' }}
        >
          Assign Entry
        </Button>
      </div>
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
                <TableCell className={classes.table_head}>Registration Number</TableCell>
                <TableCell className={classes.table_head}>Arrival Time</TableCell>
                <TableCell className={classes.table_head}>Departure Time</TableCell>
                <TableCell className={classes.table_head}>Dumped Amount</TableCell>
                <TableCell className={classes.table_head}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <TextField
                      disabled={selectedVehicle !== vehicle}
                      value={vehicle.plateNumber}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={selectedVehicle !== vehicle}
                      value={vehicle.arrivalTime}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={selectedVehicle !== vehicle}
                      value={vehicle.departureTime}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={selectedVehicle !== vehicle}
                      value={vehicle.wasteAmount}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {selectedVehicle === vehicle ? (
                      <Button variant="outlined" color="primary" onClick={handleSaveRow}>
                        Save
                      </Button>
                    ) : (
                      <Button variant="outlined" color="primary" onClick={() => handleEditRow(vehicle)}>
                        Edit
                      </Button>
                    )}
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