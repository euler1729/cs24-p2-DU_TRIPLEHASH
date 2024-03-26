import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
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

function LoginPage() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic
    console.log('Logging in...');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={10} sm={6} md={4}>
          <div className={classes.formContainer}>
            <Typography variant="h4" align="center" className={classes.title}>
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
              Forgot your password? <Link to="/forgot-password">Reset Password</Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginPage;
