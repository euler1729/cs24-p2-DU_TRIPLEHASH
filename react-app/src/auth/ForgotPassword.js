import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useNavigate } from 'react-router-dom';
import api from '../API';
// Brand
import LogoGif from '../EcoSyncBrand/logogif.gif'
import EcoBrand from '../EcoSyncBrand/EcoSyncBrand.json'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: EcoBrand.Colors.greenWhite,
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
    color: EcoBrand.Colors.green,
  },
  textField: {
    marginBottom: theme.spacing(2),
    color: EcoBrand.Colors.green,
    backgroundColor: EcoBrand.Colors.greenWhite,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: EcoBrand.Colors.green, // Green color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4caf50', // Green color
    },
  },
  button: {
    fontWeight: 'bold',
    color: EcoBrand.Colors.greenWhite,
    backgroundColor: EcoBrand.Colors.green,
    '&:hover': {
      backgroundColor: EcoBrand.Colors.greenDark,
    },
  },
  errorText: {
    color: 'red',
    marginTop: theme.spacing(2),
  },

}));

function ForgotPassword() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send request to server to send OTP
      api.post('/auth/reset-password/init', { user_name: emailOrUsername })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          navigate('/reset-password', {
            state: {
              user_name: emailOrUsername,
            },
          });
        }).catch((error) => {
          setLoading(false);
          setError(error.response.data.msg);
          console.log(error);
        });

    } catch (error) {
      setLoading(false);
      setError(error.response.data.msg);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={10} sm={6} md={4}>
          <div className={classes.formContainer}>
            <img src={LogoGif} alt="EcoSync Logo" style={{ width: '30%' }} />
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
                error={!!error}
                helperText={error}
              />
              <Button
                type="submit"
                variant="contained"
                className={classes.button}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
              </Button>
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
              Remember your password? <Link to="/login" style={{ color: EcoBrand.Colors.greenDark }}>Login</Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ForgotPassword;
