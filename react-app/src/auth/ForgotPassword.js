// ForgotPasswordPage.js
import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));

function ForgotPasswordPage() {
  const classes = useStyles();
  const [emailOrUsername, setEmailOrUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement logic to send reset password link to the provided email or username
    console.log('Reset password link sent to:', emailOrUsername);
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={10} sm={6} md={4}>
          <div className={classes.formContainer}>
            <Typography variant="h4" align="center" className={classes.title}>
              Forgot Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                id="emailOrUsername"
                label="Email or Username"
                type="text"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
              Remember your password? <Link to="/login">Login</Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ForgotPasswordPage;
