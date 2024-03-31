import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TableSortLabel, MenuItem, Select, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, makeStyles, TextField, InputAdornment } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Cookies from 'universal-cookie';

// API
import api from '../API';

// Brand
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

//User profile
import UserProfile from '../admin/UserProfile';


const initialUsers = [
  { user_id: 1, user_name: 'user1', email: 'user1@example.com', role: 'admin', name: 'User One', age: 30 },
  { user_id: 2, user_name: 'user2', email: 'user2@example.com', role: 'STS Manager', name: 'User Two', age: 25 },
  { user_id: 3, user_name: 'user3', email: 'user3@example.com', role: 'Landfill Manager', name: 'User Three', age: 35 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90vh',
    width: '75vw',
    margin: 'auto',
  },
  title: {
    // marginBottom: theme.spacing(2),
    color: EcoSyncBrand.Colors.green,
    fontWeight: 'bold',
  },

  paper: {
    // width: '100%',
  },
  input: {
    width: 100, // Fixed width for inputs during editing
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
  table_head: {
    fontWeight: 'bold',
    margin: 'auto',
  },
}));

const UserComponent = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const self = JSON.parse(localStorage.getItem('user'));
  const [users, setUsers] = useState(initialUsers);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterSTS, setFilterSTS] = useState('');
  const [filterUsername, setFilterUsername] = useState('');
  const roleOptions = ['admin', 'STS Manager', 'Landfill Manager', 'Unassigned'];
  const [stsOptions, setStsOptions] = useState([]);
  const [landfillOptions, setLandfillOptions] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState(''); // success or error

  const [Current, setCurrent] = useState(true);
  const [props, setProps] = useState({});

  useEffect(() => {
    setCurrent(true);
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    try {
      api.get('/data-entry/get-user-list', {
        headers: {
          "Authorization": `Bearer ${cookies.get('access_token')}`,
        },
        withCredentials: true
      })
        .then(response => {
          // console.log('Users:', response.data.users)
          setUsers([]);
          setStsOptions([]);
          setLandfillOptions([]);
          response.data.users.forEach(user => {
            setUsers(users => [...users, {
              user_id: user.user_id,
              user_name: user.user_name ? user.user_name : 'N/A',
              name: user.name ? user.name : 'N/A',
              role_id: user.role_id,
              assigned_to: user.sites_managed_by_user.length > 0 ? user.role_id === 2 ? user.sites_managed_by_user[0].sts_id : user.sites_managed_by_user[0].landfill_id : 0
            }]);
          });
          response.data.sts_sites.forEach(sts => {
            setStsOptions(stsOptions => [...stsOptions, sts.ward_number]);
          });
          response.data.landfill_sites.forEach(landfill => {
            setLandfillOptions(landfillOptions => [...landfillOptions, landfill.landfill_name]);
          });
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // const fetchStsOptions = () => {
  //   try {
  //     api.get('/data-entry/get-sts-list', {
  //       headers: {
  //         "Authorization": `Bearer ${cookies.get('access_token')}`,
  //       },
  //       withCredentials: true
  //     })
  //       .then(response => {
  //         console.log(response.data.sts)
  //         setStsOptions([]);
  //         response.data.sts.forEach(sts => {
  //           setStsOptions(stsOptions => [...stsOptions, sts.sts_name]);
  //         });
  //       })
  //       .catch(error => {
  //         console.error('Error fetching STS:', error);
  //       });
  //   } catch (error) {
  //     console.error('Error fetching STS:', error);
  //   }
  // };



  const handleSaveUser = () => {
    console.log('Saving user:', editingUser);
    // Save user to database
    try {
      api.put(`/users/${editingUser.user_id}`, {
        user_id: editingUser.user_id,
        user_name: editingUser.user_name,
        email: editingUser.email,
        role_id: editingUser.role_id,
        name: editingUser.name,
        age: editingUser.age
      }, {
        headers: {
          "Authorization": `Bearer ${cookies.get('access_token')}`,
        },
        withCredentials: true
      })
        .then(response => {
          fetchUsers();
          setDialogType('success');
          setDialogMessage('User Updated Successfully');
          setEditingUser(null);
          setDialogOpen(true);
          setTimeout(() => {
            setDialogOpen(false);
          }, 5000);
        })
        .catch(error => {
          console.error('Error saving user:', error);
          setDialogType('error');
          setDialogMessage(error?.response?.data?.message || 'Could not save user');
          setDialogOpen(true);
          setTimeout(() => {
            setDialogOpen(false);
          }, 5000);
        });

    } catch (error) {
      console.error('Error saving user:', error);
      setDialogType('error');
      setDialogMessage(error?.response?.data?.message || 'Could not save user');
      setDialogOpen(true);
      setTimeout(() => {
        setDialogOpen(false);
      }, 5000);
    }
  };

  const handleConfirmDelete = () => {
    console.log('Deleting user with ID:', deleteUserId);
    // Delete user from API
    try {
      api.delete(`/users/${deleteUserId}`, {
        headers: {
          "Authorization": `Bearer ${cookies.get('access_token')}`,
        },
        withCredentials: true
      })
        .then(response => {
          fetchUsers();
          setDeleteUserId(null);
          setDeleteDialogOpen(false);
          setDialogType('success');
          setDialogMessage('User Deleted Successfully');
          setDialogOpen(true);
          setTimeout(() => {
            setDialogOpen(false);
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          setDeleteDialogOpen(false);
          setDialogType('error');
          setDialogMessage(error?.response?.data?.message || 'COULD NOT DELETE THE USER');
          setDialogOpen(true);
          setTimeout(() => {
            setDialogOpen(false);
          }, 5000);
        });
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleteDialogOpen(false);
      setDialogType('error');
      setDialogMessage(error?.response?.data?.message || 'COULD NOT DELETE THE USER');
      setDialogOpen(true);
      setTimeout(() => {
        setDialogOpen(false);
      }, 5000);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteUserId(null);
    setDeleteDialogOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterRole = (e) => {
    setFilterRole(e.target.value);
  };

  const handleFilterSite = (e) => {
    setFilterSTS(e.target.value);
  };

  const handleFilterUsername = (e) => {
    setFilterUsername(e.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const filteredUsers = users.filter(user =>
    (
      searchTerm === '' || (
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roleOptions[user.role_id-1].toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stsOptions[user.assigned_to - 1]?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (landfillOptions[user.assigned_to - 1]?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ) &&
    (
      (filterRole === '' || roleOptions[user.role_id-1].toLowerCase().includes(filterRole.toLowerCase())) &&
      (filterUsername === '' || user.user_name.toLowerCase().includes(filterUsername.toLowerCase())) &&
      ((filterSTS === '' || stsOptions[user.assigned_to - 1]?.toLowerCase().includes(filterSTS.toLowerCase()))) && 
      (((filterSTS === '' || landfillOptions[user.assigned_to - 1]?.toLowerCase().includes(filterSTS.toLowerCase()))))
    )
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const switchPage = (user_id) => {
    setProps({ user_id: user_id, prev: 'assign_manager' });
    setCurrent(!Current);
  }

  return (
    Current ?
      <>
        <Grid container spacing={2} className={classes.root}>
          <Grid container item xs={12} >
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center" style={{ justifyContent: 'space-between', marginBottom: '60px' }}>
                <Grid item xs={12} style={{ height: '0px' }}>
                  <Typography variant="h4" align="center" className={classes.title}>
                    Assign Manager
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} alignItems="center" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
                <Grid item>
                  <TextField
                    label="Filter Username"
                    className={classes.textField}
                    value={filterUsername}
                    onChange={handleFilterUsername}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Filter Role"
                    className={classes.textField}
                    value={filterRole}
                    onChange={handleFilterRole}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Filter Site"
                    className={classes.textField}
                    value={filterSTS}
                    onChange={handleFilterSite}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>

                {/* <Grid item>
                  <TextField
                    label="Filter Age"
                    className={classes.textField}
                    value={filterAge}
                    onChange={handleFilterAge}
                    variant="outlined"
                    margin="dense"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </Grid> */}
              </Grid>

              <Grid container item xs={12}>
                {/* Search */}
                <Grid item xs={12} style={{ marginBottom: '20px' }}>
                  <TextField
                    label="Search"
                    className={classes.textField}
                    value={searchTerm}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                {/* User List */}
                <Grid item xs={12}>
                  <Paper elevation={3} className={classes.paper}>
                    <TableContainer>
                      <Table>
                        <TableHead >
                          <TableRow >
                            <TableCell>
                              <TableSortLabel className={classes.table_head} active={sortBy === 'user_name'} direction={sortOrder} onClick={() => handleSort('user_name')}>USERNAME</TableSortLabel>
                            </TableCell>
                            <TableCell className={classes.table_head} >NAME</TableCell>
                            <TableCell>
                              <TableSortLabel className={classes.table_head} active={sortBy === 'role_id'} direction={sortOrder} onClick={() => handleSort('role_id')}>ROLE</TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel className={classes.table_head} active={sortBy === 'assigned_to'} direction={sortOrder} onClick={() => handleSort('assigned_to')}>ASSIGNED</TableSortLabel>
                            </TableCell>
                            <TableCell className={classes.table_head} >EDIT</TableCell>
                            <TableCell className={classes.table_head} >DELETE</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedUsers.map(user => (
                            <TableRow key={user.user_id} >
                              <TableCell>
                                {false? (
                                  <TextField
                                    name="user_name"
                                    value={editingUser.user_name}
                                    onChange={(e) => setEditingUser({ ...editingUser, user_name: e.target.value })}
                                    className={classes.textField}
                                  />
                                ) : (
                                  <span
                                    style={{ color: self?.user_id === user.user_id ? EcoSyncBrand.Colors.green : 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => switchPage(user.user_id)}>
                                    {user.user_name}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {false? (
                                  <TextField
                                    name="name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className={classes.textField}
                                  />
                                ) : (
                                  <span style={{ color: self?.user_id === user.user_id ? EcoSyncBrand.Colors.green : 'black' }}>{user.name}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {
                                  editingUser && editingUser.user_id === user.user_id ?
                                    <Select name="role" label='Role' value={editingUser.role_id} onChange={(e) => setEditingUser({ ...editingUser, role_id: e.target.value })} >
                                      <MenuItem value={1}>Admin</MenuItem>
                                      <MenuItem value={2}>STS Manager</MenuItem>
                                      <MenuItem value={3}>Landfill Manager</MenuItem>
                                      <MenuItem value={4}>Unassigned</MenuItem>
                                    </Select> :
                                    <span style={{ color: self?.user_id === user.user_id ? EcoSyncBrand.Colors.green : 'black' }}>{roleOptions[user.role_id - 1]}</span>
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  editingUser && editingUser.user_id === user.user_id ?
                                    <Select name="assigned_to" label='Assigned To' value={editingUser.assigned_to} onChange={(e) => setEditingUser({ ...editingUser, assigned_to: e.target.value })} >
                                      {
                                        editingUser.role_id === 2 ?
                                          stsOptions.map((sts, index) => (
                                            <MenuItem key={index} value={index + 1}>{sts}</MenuItem>
                                          )) :
                                          editingUser.role_id === 3 ?
                                            landfillOptions.map((landfill, index) => (
                                              <MenuItem key={index} value={index + 1}>{landfill}</MenuItem>
                                            )) : <MenuItem value={0}>N/A</MenuItem>
                                      }
                                    </Select> :
                                    <span style={{ color: self?.user_id === user.user_id ? EcoSyncBrand.Colors.green : 'black' }}>
                                      {user.role_id === 1 ? 'N/A' : user.assigned_to === 0 ? 'N/A' : 
                                      user.role_id === 4 ? 'N/A' : user.role_id === 2 ? stsOptions[user.assigned_to - 1] : landfillOptions[user.assigned_to - 1]}
                                    </span>
                                }
                              </TableCell>
                              {
                                editingUser && editingUser.user_id === user.user_id ? (
                                  <TableCell>
                                    <Button style={{ color: 'white', backgroundColor: EcoSyncBrand.Colors.greenDark, fontWeight: 'bold' }} variant="contained" onClick={handleSaveUser}>Save</Button>
                                  </TableCell>
                                ) : (
                                  <React.Fragment>
                                    <TableCell>
                                      <Button className={classes.button} variant="outlined" onClick={() => handleEditUser(user)}>Edit</Button>
                                    </TableCell>
                                    <TableCell>
                                      <IconButton color="secondary" onClick={() => handleDeleteUser(user.user_id)}><Delete /></IconButton>
                                    </TableCell>
                                  </React.Fragment>
                                )
                              }
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

              </Grid>
            </Grid>
          </Grid>


          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this user?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
              <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
          {/* Dialog */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle style={{ color: dialogType === 'success' ? EcoSyncBrand.Colors.green : 'red', fontWeight: 'bold' }}>{dialogType === 'success' ? 'Success' : 'Failure'}</DialogTitle>
            <DialogContent color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
              <Typography>{dialogMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </>
      :
      <UserProfile props={props} />
  );
};

export default UserComponent;