import React, { useState } from 'react';
import { Grid, Paper, Typography, Avatar, makeStyles, TextField, Button } from '@material-ui/core';

// Sample user data
const user = {
  name: 'John Doe',
  username: 'johndoe123',
  email: 'johndoe@example.com',
  age: 30,
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  profileImage: 'https://via.placeholder.com/150', // URL to profile image
};

// Styles for the component
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    
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
    marginTop: theme.spacing(2),
  },
}));

// ProfileView component
const ProfileView = () => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);

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
          <Avatar alt={user.name} src={user.profileImage} className={classes.avatar} />
          <Typography variant="h5" gutterBottom>{user.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">@{user.username}</Typography>
          {editMode ? (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                defaultValue={user.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Age"
                defaultValue={user.age}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={4}
                label="Bio"
                defaultValue={user.bio}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.editButton}
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
