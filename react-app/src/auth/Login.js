import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button, InputAdornment, IconButton, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
// Brand
import LogoGif from '../EcoSyncBrand/logogif.gif'
import EcoBrand from '../EcoSyncBrand/EcoSyncBrand.json'
import api from '../API';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
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
    margin: theme.spacing(2),
  },
}));

function LoginPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user_name_error, setUserNameError] = useState('');
  const [password_error, setPasswordError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role_id === 1) {
        navigate('/admin/dashboard');
      }
      else if (user.role_id === 2) {
        navigate('/sts/dashboard');
      }
      else if (user.role_id === 3) {
        navigate('/landfill/dashboard');
      } else {
        navigate('/');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user_name) {
      setUserNameError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password.');
      return;
    }
    setUserNameError('');
    setPasswordError('');
    setLoading(true);
    console.log(user_name, password);
    try{
      api.post('/auth/login', {
        user_name: user_name,
        password: password
      }).then((response) => {
        console.log(response);
        if (response.status <300) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          cookies.set('access_token', response.data.access_token, { path: '/' });
          if (response.data.user.role_id === 1) {
            navigate('/admin/dashboard');
          }
          else if (response.data.user.role_id === 2) {
            navigate('/sts/dashboard');
          }
          else if (response.data.user.role_id === 3) {
            navigate('/landfill/dashboard');
          } else {
            navigate('/');
          }
        }
        else {
          setError(response.data.msg);
        }
  
      }).catch((error) => {
        console.log(error);
        setError(error.response.data.msg);
      });
      setLoading(false);
    }catch(error){
      console.log(error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={10} sm={6} md={4}>
          <div className={classes.formContainer}>
            <img src={LogoGif} alt="EcoSync Logo" style={{ width: '30%' }} />
            <Typography variant="h4" align="center" className={classes.title}>
              Login
            </Typography>
            {
              error && (
                <Typography variant="body2" className={classes.errorText}>
                  {error}
                </Typography>
              )
            }
            <form onSubmit={handleSubmit}>
              <TextField
                id="email"
                label="Email or Username"
                type="text"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={user_name}
                onChange={(e) => { setUserName(e.target.value); setUserNameError(''); }}
                error={!!user_name_error}
                helperText={user_name_error}
              />
              <TextField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!password_error}
                helperText={password_error}
              />
              <Button
                type="submit"
                variant="contained"
                className={classes.button}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
              Forgot your password? <Link to="/forgot-password" style={{ color: EcoBrand.Colors.greenDark }}>Reset Password</Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginPage;
