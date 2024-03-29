import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Avatar, makeStyles, TextField, Button } from '@material-ui/core';

import avatar from './res/avatar.png';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

// Sample user data
const user = {
  name: 'John Doe',
  username: 'johndoe123',
  email: 'johndoe@example.com',
  age: 30,
  phone_number: '01234',
  profileImage: 'https://via.placeholder.com/150', // URL to profile image
};

// Styles for the component
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: '0 auto',
  },
  editButton: {
    color: EcoSyncBrand.Colors.green,
    backgroundColor: EcoSyncBrand.Colors.greenWhite,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-s': {
      borderColor: EcoSyncBrand.Colors.green, // Green color
    },

  },
  textField: {
    marginBottom: theme.spacing(2),
    color: EcoSyncBrand.Colors.green,
    backgroundColor: EcoSyncBrand.Colors.greenWhite,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: EcoSyncBrand.Colors.green, // Green color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: EcoSyncBrand.Colors.green, // Green color
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
    marginLeft: theme.spacing(1), // Adjust spacing as needed
  },
}));

// ProfileView component
const ProfileView = () => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [user_name, setUser_name] = useState('');
  const [role, setRole] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const roles = ['Admin', 'STS Manager', 'Landfill Manager', 'Unassigned'];
  const [newInfo, setNewInfo] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUser(user);
    setNewInfo(user);
    if (user) {
      setName(user.name?.toUpperCase());
      setEmail(user.email);
      setAge(user.age);
      setUser_name(user.user_name);
      setPhone_number('01234567890');
      if (user.role_id) {
        setRole(roles[user.role_id - 1].toLowerCase());
      }
    }
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    // Save changes to the backend
  };

  return (
    <Grid container spacing={3} justify="center" className={classes.root}>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Avatar alt={user.name} src={avatar} className={classes.avatar} />
          <Typography variant="h5" gutterBottom >
            <span style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>{name} </span>
            <span style={{ color: 'gray', fontSize: '15px' }}>{age}</span>
          </Typography>
          <Typography variant="body1" color="textSecondary">{phone_number}</Typography>
          <Typography variant="body1" color="textSecondary">{user.email}</Typography>
          <Typography variant="subtitle1" color="textSecondary">User Name: {role}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Role: {role}</Typography>

          {editMode ? (
            <>
              <TextField
                className={classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Name"
                defaultValue={newInfo.name}
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                defaultValue={newInfo.email}
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Phone Number"
                defaultValue={newInfo.phone_number}
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Age"
                defaultValue={newInfo.age}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              className={classes.editButton}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfileView;
