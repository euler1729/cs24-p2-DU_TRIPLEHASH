import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TableSortLabel, MenuItem, Select, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, makeStyles, TextField, InputAdornment } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import Cookies from 'universal-cookie';

// API
import api from '../API';

// Brand
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const initialVehicles = [
  { vehicle_id: 1, vehicle_name: 'Truck 1', status: 'Available', ward_number: '1' },
  { vehicle_id: 2, vehicle_name: 'Truck 2', status: 'Assigned', ward_number: '5' },
  { vehicle_id: 3, vehicle_name: 'Truck 3', status: 'Available', ward_number: '10' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90vh',
    width: '75vw',
    margin: 'auto',
  },
  title: {
    color: EcoSyncBrand.Colors.green,
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  paper: {
    width: '100%',
  },
  button: {
    color: EcoSyncBrand.Colors.green,
    backgroundColor: EcoSyncBrand.Colors.greenWhite,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: EcoSyncBrand.Colors.green, // Green color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4caf50', // Green color
    },
  },
  textField: {
    margin: 'auto',
    color: EcoSyncBrand.Colors.green,
    backgroundColor: EcoSyncBrand.Colors.greenWhite,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: EcoSyncBrand.Colors.green, // Green color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4caf50', // Green color
    },
  },
}));

const VehicleAssignment = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterWard, setFilterWard] = useState('');
  const statusOptions = ['Available', 'Assigned'];
  const [stslist, setStslist] = useState([]);

  useEffect(() => {
    fetchVehicles();
    fetchSts();
  }, []);

  const fetchSts = () => {
    // Fetch sts from API and set state
    try {
      api.get('/data-entry/get-sts-list', {
        headers: {
          'Authorization': `Bearer ${cookies.get('token')}`
        },
        withCredentials: true
      }).then((res) => {
        setStslist(res.data);
        console.log(res.data);
      })
    } catch (e) {
      console.log(e);
    }
  };

  const fetchVehicles = () => {
    // Fetch vehicles from API and set state
    try {
      api.get('/data-entry/get-vehicle-list', {
        headers: {
          'Authorization': `Bearer ${cookies.get('token')}`
        },
        withCredentials: true
      }).then((res) => {
        setVehicles(res.data);
        console.log(res.data);
      })
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveVehicle = () => {
    // Save vehicle to database
    try {
      api.put('/data-entry/assign-sts-vehicles', {
        sts_id: editingVehicle.sts_id,
        vehicle_id: editingVehicle.vehicle_id
      }, {
        headers: {
          "Authorization": `Bearer ${cookies.get('access_token')}`,
        },
        withCredentials: true
      }).then((res) => {
        console.log(res.data);
        fetchVehicles();
        setEditingVehicle(null);
      }).catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  };
  
  const handleConfirmDelete = () => {
    // Delete vehicle from API
    try {
      api.delete(`/data-entry/delete-vehicle/${deleteVehicleId}`, {
        headers: {
            "Authorization": `Bearer ${cookies.get('access_token')}`,
        },
        withCredentials: true
    }).then((res) => {
        console.log(res.data);
        fetchVehicles();
        setDeleteVehicleId(null);
        setDeleteDialogOpen(false);
      })
    }catch(e){
      console.log(e);
    }
    
  };

  const handleSort = (column) => {
    // Handle sorting logic
  };

  const handleEditVehicle = (vehicle) => {
    // Handle editing a vehicle
    setEditingVehicle(vehicle);
  };

  const handleDeleteVehicle = (vehicleId) => {
    // Handle deleting a vehicle
    setDeleteVehicleId(vehicleId);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    // Handle canceling delete operation
    setDeleteVehicleId(null);
    setDeleteDialogOpen(false);
  };

  const handleInputChange = (e) => {
    // Handle input change for search term
    setSearchTerm(e.target.value);
  };

  const handleFilterStatus = (e) => {
    // Handle filtering vehicles by status
    setFilterStatus(e.target.value);
  };

  const handleFilterWard = (e) => {
    // Handle filtering vehicles by ward number
    setFilterWard(e.target.value);
  };
  function convertString(str) {
    // Convert first character to uppercase
    str = str.charAt(0).toUpperCase() + str.slice(1);

    // Insert space before every uppercase letter (except the first one)
    str = str.replace(/([A-Z])/g, ' $1');

    return str;
  }
  // Inside the VehicleAssignment component
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filterStatus && (vehicle.sts_id ? vehicle.sts_id != 0 ? 'Assigned' : 'Available' : 'Available') !== filterStatus) {
      return false;
    }
    if (filterWard && vehicle.ward_number !== filterWard) {
      return false;
    }
    if (searchTerm && !vehicle.vehicle_reg_number.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const clearFilter = () => {
    setFilterStatus('');
    setFilterWard('');
    setSearchTerm('');
  }
  function convertString(str) {
    // Convert first character to uppercase
    str = str.charAt(0).toUpperCase() + str.slice(1);

    // Insert space before every uppercase letter (except the first one)
    str = str.replace(/([A-Z])/g, ' $1');

    return str;
  }


  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" className={classes.title}>
          Vehicle Assignment
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" style={{ marginBottom: '20px' }}>
          <Grid item xs={2}>
            <TextField
              className={classes.textField}
              label="Filter Status"
              value={filterStatus}
              onChange={handleFilterStatus}
              select
              variant="outlined"
              margin="dense"
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Button variant="outlined" className={classes.button} onClick={clearFilter}>Clear filter</Button>
          {/* <Grid item>
            <TextField
              label="Filter STS"
              value={filterWard}
              onChange={handleFilterWard}
              variant="outlined"
              margin="dense"
              fullWidth
            />
          </Grid> */}
        </Grid>
        <TextField
          className={classes.textField}
          label="Search"
          value={searchTerm}
          onChange={handleInputChange}
          variant="outlined"
          margin="dense"
          fullWidth
        />
        <Paper elevation={3} className={classes.paper}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Vehicle Reg No
                  </TableCell>
                  <TableCell>
                    Vehicle Type
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === 'status'} direction={sortOrder} onClick={() => handleSort('status')}>
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortBy === 'ward_number'} direction={sortOrder} onClick={() => handleSort('ward_number')}>
                      STS
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Edit/Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicle_reg_number}>
                    <TableCell>{vehicle.vehicle_reg_number}</TableCell>
                    <TableCell>{vehicle.vehicle_type?.replace(/([A-Z])/g, ' $1').toUpperCase()}</TableCell>
                    <TableCell>{vehicle.sts_id ? 'Assigned' : 'Available'}</TableCell>
                    <TableCell>
                      {
                        editingVehicle && editingVehicle.vehicle_id === vehicle.vehicle_id ? (
                          <TextField
                            value={editingVehicle.sts_id}
                            select
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, sts_id: e.target.value })}
                            variant="outlined"
                          >
                            <MenuItem value={0}>None</MenuItem>
                            {stslist.map((sts) => (
                              <MenuItem key={sts.sts_id} value={sts.sts_id}>
                                STS {sts.sts_id}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          vehicle.sts_id ? 'STS ' + vehicle.sts_id : 'Unassigned'
                        )
                      }
                    </TableCell>
                    <TableCell>
                      {
                        editingVehicle && editingVehicle.vehicle_id === vehicle.vehicle_id ? (
                          <React.Fragment>
                            <TableCell>
                              <Button style={{ color: 'white', backgroundColor: EcoSyncBrand.Colors.greenDark, fontWeight: 'bold' }} variant="contained" onClick={handleSaveVehicle}>Save</Button>
                            </TableCell>
                            <TableCell>
                              <Button variant="contained" color="secondary" onClick={() => setEditingVehicle(null)}>Cancel</Button>
                            </TableCell>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <TableCell>
                              <Button variant='outlined' className={classes.button} onClick={() => handleEditVehicle(vehicle)}>
                                <Edit /> Edit
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button variant="contained" color="secondary" onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}>
                                <Delete />
                              </Button>
                            </TableCell>
                          </React.Fragment>
                        )
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this vehicle?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default VehicleAssignment;
