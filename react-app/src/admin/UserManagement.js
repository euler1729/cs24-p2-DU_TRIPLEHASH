import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TableSortLabel, MenuItem, Select, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, makeStyles, TextField, InputAdornment } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Cookies from 'universal-cookie';

// API
import api from '../API';

// Brand
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const initialUsers = [
  { user_id: 1, user_name: 'user1', email: 'user1@example.com', role: 'admin', name: 'User One', age: 30 },
  { user_id: 2, user_name: 'user2', email: 'user2@example.com', role: 'STS Manager', name: 'User Two', age: 25 },
  { user_id: 3, user_name: 'user3', email: 'user3@example.com', role: 'Landfill Manager', name: 'User Three', age: 35 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    color: EcoSyncBrand.Colors.green,
    fontWeight: 'bold',
  },
  form: {
    '& > *': {
      marginBottom: theme.spacing(2),
      width: '60%',
    },
  },
  paper: {
    padding: theme.spacing(2),
    // width: '100%',
  },
  input: {
    width: 100, // Fixed width for inputs during editing
  },
  textField: {
    marginBottom: theme.spacing(2),
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
    fontWeight: 'bold'
  },
}));

const UserComponent = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [users, setUsers] = useState(initialUsers);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterUsername, setFilterUsername] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const roleOptions = ['admin', 'STS Manager', 'Landfill Manager', 'Unassigned'];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState(''); // success or error


  useEffect(() => {
    fetchUsers();
  }, [users]);

  const fetchUsers = () => {
    try {
      api.get('/users', {
        headers: {
          "Authorization": `Bearer ${cookies.get('access_token')}`,
        },
        withCredentials: true
      })
        .then(response => {
          setUsers([])
          response.data.users.forEach(user => {
            setUsers(users => [...users, {
              user_id: user.user_id,
              user_name: user.user_name ? user.user_name : 'N/A',
              email: user.email ? user.email : 'N/A',
              role: user.role_id ? roleOptions[user.role_id - 1] : 'N/A',
              name: user.name ? user.name : 'N/A',
              age: user.age ? user.age : 'N/A'
            }]);
          });
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSaveUser = () => {
    console.log('Saving user:', editingUser);
    // Save user to database
    try {
      api.put(`/users/${editingUser.user_id}`, {
        user_id: editingUser.user_id,
        user_name: editingUser.user_name,
        email: editingUser.email,
        role_id: roleOptions.indexOf(editingUser.role) + 1,
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
        })
        .catch(error => {
          console.error('Error saving user:', error);
          setDialogType('error');
          setDialogMessage(error?.response?.data?.message || 'Could not save user');
          setDialogOpen(true);
        });

    } catch (error) {
      console.error('Error saving user:', error);
      setDialogType('error');
      setDialogMessage(error?.response?.data?.message || 'Could not save user');
      setDialogOpen(true);
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
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          setDeleteDialogOpen(false);
          setDialogType('error');
          setDialogMessage(error?.response?.data?.message || 'COULD NOT DELETE THE USER');
          setDialogOpen(true);
        });
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleteDialogOpen(false);
      setDialogType('error');
      setDialogMessage(error?.response?.data?.message || 'COULD NOT DELETE THE USER');
      setDialogOpen(true);
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

  const handleFilterEmail = (e) => {
    setFilterEmail(e.target.value);
  };

  const handleFilterUsername = (e) => {
    setFilterUsername(e.target.value);
  };

  const handleFilterAge = (e) => {
    setFilterAge(e.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.age.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" className={classes.title}>
          USERS
        </Typography>
      </Grid>

      {/* Filter */}
      <Grid container spacing={2} alignItems="center" style={{ justifyContent: 'space-around' }}>
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
            label="Filter Email"
            className={classes.textField}
            value={filterEmail}
            onChange={handleFilterEmail}
            variant="outlined"
            margin="dense"
          />
        </Grid>
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
        </Grid>
      </Grid>
      <Grid item xs={12}>
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
                  <TableCell>
                    <TableSortLabel className={classes.table_head} active={sortBy === 'email'} direction={sortOrder} onClick={() => handleSort('email')}>EMAIL</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel className={classes.table_head} active={sortBy === 'role'} direction={sortOrder} onClick={() => handleSort('role')}>ROLE</TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.table_head} >NAME</TableCell>
                  <TableCell>
                    <TableSortLabel className={classes.table_head} active={sortBy === 'age'} direction={sortOrder} onClick={() => handleSort('age')}>AGE</TableSortLabel>
                  </TableCell>
                  <TableCell className={classes.table_head} >EDIT</TableCell>
                  <TableCell className={classes.table_head} >DELETE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedUsers.map(user => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      {editingUser && editingUser.user_id === user.user_id ? (
                        <TextField
                          name="user_name"
                          value={editingUser.user_name}
                          onChange={(e) => setEditingUser({ ...editingUser, user_name: e.target.value })}
                          className={classes.textField}
                        />
                      ) : (
                        user.user_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser && editingUser.user_id === user.user_id ? (
                        <TextField
                          name="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className={classes.textField}
                        />
                      ) : (
                        user.email
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        editingUser && editingUser.user_id === user.user_id ?
                          <Select name="role" label='Role' value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="STS Manager">STS Manager</MenuItem>
                            <MenuItem value="Landfill Manager">Landfill Manager</MenuItem>
                            <MenuItem value="Unassigned">Unassigned</MenuItem>
                          </Select> : user.role
                      }
                    </TableCell>
                    <TableCell>
                      {editingUser && editingUser.user_id === user.user_id ? (
                        <TextField
                          name="name"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          className={classes.textField}
                        />
                      ) : (
                        user.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser && editingUser.user_id === user.user_id ? (
                        <TextField
                          name="age"
                          value={editingUser.age}
                          onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
                          className={classes.textField}
                          type="number"
                        />
                      ) : (
                        user.age
                      )}
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
  );
};

export default UserComponent;