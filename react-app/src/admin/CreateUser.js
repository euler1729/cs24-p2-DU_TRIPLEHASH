import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Select, MenuItem, Grid, Paper, makeStyles, InputAdornment, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Cookies from 'universal-cookie';
// API
import api from '../API';

//Brand
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        width: '75vw',
        margin: 'auto',
    },
    title: {
        fontWeight: 'bold',
        color: EcoSyncBrand.Colors.greenTeaDark,
    },
    paper: {
        padding: theme.spacing(3),
        backgroundColor: '#f5f5f5',
        borderRadius: theme.spacing(2),
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    form: {
        '& > *': {
            marginBottom: theme.spacing(2),
            width: '100%',
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
    outlinedSelect: {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: EcoSyncBrand.Colors.green, // Change to green color
            },
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

const CreateUser = () => {
    const classes = useStyles();
    const cookies = new Cookies();
    const [newUser, setNewUser] = useState({ user_name: '', email: '', role: 4, password: '', name: '', age: '', phone_number: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error


    useEffect(() => {
        if (dialogOpen) {
            const timer = setTimeout(() => {
                setDialogOpen(false);
            }, 10000); // 10 seconds timeout

            return () => {
                clearTimeout(timer);
            };
        }
    }, [dialogOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
        // Clear errors when input changes
        setErrors({ ...errors, [name]: '' });
    };

    const validateInputs = () => {
        const newErrors = {};

        // Validation for user_name
        if (!newUser.user_name) {
            newErrors.user_name = 'Username is required';
        }

        // Validation for email
        if (!newUser.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Validation for role (assuming it should not be 'Unassigned')
        // if (newUser.role === 'Unassigned') {
        //     newErrors.role = 'Role must be assigned';
        // }

        // Validation for password (assuming it should have a minimum length)
        if (!newUser.password || newUser.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Validation for name
        if (!newUser.name) {
            newErrors.name = 'Name is required';
        }

        // Validation for age (assuming it should be a number greater than 0)
        if (!newUser.age || isNaN(newUser.age) || newUser.age <= 0) {
            newErrors.age = 'Age must be a valid number greater than 0';
        }

        // Set errors state
        setErrors(newErrors);

        // Return true if there are no errors, false otherwise
        return Object.keys(newErrors).length === 0;
    };


    const handleCreateUser = () => {
        if (!validateInputs()) {
            console.log(errors)
            return;
        }
        if (!cookies.get('access_token')) {
            localStorage.removeItem('user');
            cookies.remove('access_token');
            window.location.href = '/';
        }
        console.log(newUser)
        try {
            setLoading(true);
            api.post('/users', {
                "role_id": newUser.role,
                "user_name": newUser.user_name,
                "password": newUser.password,
                "name": newUser.name,
                "age": newUser.age,
                "email": newUser.email,
                "phone_number": newUser.phone_number
            }, {
                headers: {
                    "Authorization": `Bearer ${cookies.get('access_token')}`,
                },
                withCredentials: true
            }).then((response) => {
                console.log(response);
                setLoading(false);
                if (response.status < 300) {
                    setLoading(false);
                    setNewUser({ user_name: '', email: '', role: 4, password: '', name: '', age: '', phone_number: '' });
                    setDialogType('success');
                    setDialogMessage('User created successfully');
                    setDialogOpen(true);
                    setTimeout(() => {
                        setDialogOpen(false);
                    }, 5000);
                }
            }).catch((error) => {
                console.log(error);
                setLoading(false);
                setDialogType('error');
                setDialogMessage(error?.response?.data?.msg || 'Could not create user. Please try again');
                setDialogOpen(true);
                setTimeout(() => {
                    setDialogOpen(false);
                }, 5000);
            });
        } catch (error) {
            console.log(error);
            setLoading(false);
            setDialogType('error');
            setDialogMessage(error.response.data.msg || 'Could not create user. Please try again');
            setDialogOpen(true);
            setTimeout(() => {
                setDialogOpen(false);
            }, 5000);
        }
    };
    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography className={classes.title} variant="h5" align="center" gutterBottom>Create New User</Typography>
                        <form className={classes.form}>
                            <TextField
                                className={classes.textField}
                                name="name"
                                label="Name"
                                variant="outlined"
                                value={newUser.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                            <TextField
                                className={classes.textField}
                                name="user_name"
                                label="Username"
                                variant="outlined"
                                value={newUser.user_name}
                                onChange={handleInputChange}
                                error={!!errors.user_name}
                                helperText={errors.user_name}
                            />
                            <TextField
                                className={classes.textField}
                                name="email"
                                label="Email"
                                variant="outlined"
                                value={newUser.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            {/* Add similar TextField components for other fields */}
                            <Select
                                name="role"
                                variant="outlined"
                                value={newUser.role}
                                onChange={handleInputChange}
                                className={classes.outlinedSelect}
                            >
                                <MenuItem value={1}>Admin</MenuItem>
                                <MenuItem value={2}>STS Manager</MenuItem>
                                <MenuItem value={3}>Landfill Manager</MenuItem>
                                <MenuItem value={4}>Unassigned</MenuItem>
                            </Select>

                            <TextField
                                className={classes.textField}
                                name='password'
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                fullWidth
                                value={newUser.password}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePasswordVisibility}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <TextField
                                className={classes.textField}
                                name="age"
                                label="Age"
                                variant="outlined"
                                value={newUser.age}
                                type='number'
                                onChange={handleInputChange}
                                error={!!errors.age}
                                helperText={errors.age}
                            />

                            <Button
                                className={classes.button}
                                variant="contained"
                                fullWidth
                                onClick={handleCreateUser}
                            >
                                {loading ? 'Creating...' : 'Create User'}
                                {loading && <CircularProgress size={20} className={classes.circularProgress} />}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>{dialogType === 'success' ? 'Success' : 'Failure'}</DialogTitle>
                <DialogContent color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color={dialogType === 'success' ? EcoSyncBrand.Colors.green : 'secondary'}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateUser;
