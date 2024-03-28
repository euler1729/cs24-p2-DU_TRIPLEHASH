import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  countdown: {
    margin: theme.spacing(2),
    textAlign: 'center',
    color: EcoBrand.Colors.green,
  },
}));

function ResetPassword() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    setEmailOrUsername(location.state.user_name);
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send request to server to reset password
      api.post('/auth/reset-password/confirm', {
        user_name: emailOrUsername,
        new_password: newPassword,
        otp: otp,
      }).then((response) => {
        console.log(response.data);
        setLoading(false);
        navigate('/login');
      }).catch((error) => {
        setLoading(false);
        setError(error.response.data.msg);
      });
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  };

  const formatTime = () => {
    if (countdown <= 0) {
      return '0:00';
    }
    const minutes = Math.floor(countdown / 60);
    const remainingSeconds = Math.floor(countdown % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={10} sm={6} md={4}>
          <div className={classes.formContainer}>
            <img src={LogoGif} alt="EcoSync Logo" style={{ width: '30%' }} />
            <Typography variant="h4" align="center" className={classes.title}>
              Reset Password
            </Typography>
            <Typography variant="body2" align="center" className={classes.countdown}>
              Enter the OTP sent to your email to reset your password.
            </Typography>
            <div className={classes.countdown}>
              <Typography variant="body2">
                Time remaining less than {formatTime()}
              </Typography>
            </div>
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
              <TextField
                id="newPassword"
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== newPassword}
                helperText={confirmPassword !== newPassword ? "Passwords don't match" : ''}
              />
              <TextField
                id="otp"
                label="OTP"
                type="text"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                className={classes.button}
                fullWidth
                disabled={loading || confirmPassword !== newPassword}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
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

export default ResetPassword;

