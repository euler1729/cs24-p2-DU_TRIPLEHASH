import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Avatar, makeStyles, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
// import { Visibility, VisibilityOff } from '@material-ui/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

import avatar from './res/avatar.png';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';
import api from '../API';
import UserManagement from './UserManagement';
import AssignManager from './AssignManager';

// Styles for the component
const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        width: '75vw',
    },
    title: {
        // marginBottom: theme.spacing(2),
        color: EcoSyncBrand.Colors.green,
        fontWeight: 'bold',
        marginBottom: theme.spacing(2),
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
        marginBottom: theme.spacing(1),
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

const ProfileView = ({ props }) => {
    const classes = useStyles();
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [isProfile, setIsProfile] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editPasswordMode, setEditPasswordMode] = useState(false);
    const [user, setUser] = useState({});
    const roles = ['Admin', 'STS Manager', 'Landfill Manager', 'Unassigned'];
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState(''); // success or error
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirmPassword: '',
    });
    const [prevPage, setPrevPage] = useState("prev");

    useEffect(() => {
        // const user = JSON.parse(localStorage.getItem('user'));
        // console.log(prevPage);
        setIsProfile(true);
        setPrevPage(props.prev);
        getUser(props.user_id);
        setUser(user);
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
        setEditPasswordMode(false);
    };
    const handlePasswordEditClick = () => {
        setEditPasswordMode(true);
        setEditMode(false);
    };
    const getUser = (user_id) => {
        api.get(`/users/${user_id}`, {
            headers: {
                "Authorization": `Bearer ${cookies.get('access_token')}`,
            },
            withCredentials: true
        }).then((response) => {
            console.log(response.data);
            setUser(response.data.user);
        }
        ).catch((error) => {
            console.log(error);
        });
    }
    const handleSaveClick = () => {
        // Save changes to the backend
        api.put('/profile', user, {
            headers: {
                "Authorization": `Bearer ${cookies.get('access_token')}`,
            },
            withCredentials: true
        }).then((response) => {
            setDialogType('success');
            setDialogMessage('Profile Updated Successfully');
            setDialogOpen(true);
            setEditMode(false);
            localStorage.setItem('user', JSON.stringify(user));
        }).catch((error) => {
            setDialogType('error');
            setDialogMessage('Failed to update profile');
            setDialogOpen(true);
        });
    };

    const handlePasswordSaveClick = () => {
        if (passwordData.old_password === '') {
            setErrors({ ...errors, old_password: 'Please fill all fields' });
            return;
        }
        if (passwordData.new_password !== passwordData.confirmPassword) {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
            return;
        }
        if (passwordData.new_password.length < 6) {
            setErrors({ ...errors, new_password: 'Password must be at least 6 characters long' });
            return;
        }
        // Save changes to the backend
        api.put('/profile', passwordData, {
            headers: {
                "Authorization": `Bearer ${cookies.get('access_token')}`,
            },
            withCredentials: true
        }).then((response) => {
            setDialogType('success');
            setDialogMessage('Password Changed Successfully');
            setDialogOpen(true);
            setEditPasswordMode(false);
        }).catch((error) => {
            setDialogType('error');
            setDialogMessage('Failed to Change Password');
            setDialogOpen(true);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'age' && value < 0) return;
        setUser({ ...user, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleClose = () => {
        setEditMode(false);
        setEditPasswordMode(false);
    }

    const switchPage = () => {
        setIsProfile(!isProfile);
    }

    return (
        isProfile ?
            <>
                <div onClick={() => setIsProfile(false)} style={{ display: 'flex', alignItems: 'center', margin: '40px', fontWeight: 800, color: EcoSyncBrand.Colors.greenDark, cursor: 'pointer' }}>
                    <ArrowBackIosIcon style={{ marginRight: '5px' }} />
                    {'Back'}
                </div>
                <Grid container spacing={3} justifyContent="center" className={classes.root}>

                    <Grid item xs={12} sm={8} md={6} justifyContent='center'>
                        <Typography variant="h4" align="center" className={classes.title}>
                            User Details
                        </Typography>
                        <Paper elevation={3} className={classes.paper}>
                            <Avatar alt={user.name} src={avatar} className={classes.avatar} />
                            <Typography variant="h5" gutterBottom >
                                <span style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>{user?.name?.toUpperCase()} </span>
                                <span style={{ color: 'gray', fontSize: '15px' }}>{user ? user.age + 'y' : ''}</span>
                            </Typography>
                            <Typography variant="body1" color="textSecondary">{user?.phone_number}</Typography>
                            <Typography variant="body1" color="textSecondary">{user?.email}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">User Name: {user?.user_name}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Role: {user ? roles[user.role_id - 1]?.toUpperCase() : 'Unassigned'}</Typography>


                            {/* End of password change section */}

                            {(editMode && !editPasswordMode) && (
                                <>
                                    <Typography variant="h6" style={{ marginTop: '16px', color: EcoSyncBrand.Colors.greenTeaDark, fontWeight: 'bold' }}>EDIT INFO</Typography>
                                    <TextField
                                        className={classes.textField}
                                        name="name"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Name"
                                        value={user.name}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        className={classes.textField}
                                        name='email'
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Email"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        value={user.email}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        className={classes.textField}
                                        name='phone_number'
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Phone Number"
                                        error={!!errors.phone_number}
                                        helperText={errors.phone_number}
                                        value={user.phone_number}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        className={classes.textField}
                                        name='age'
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Age"
                                        type='number'
                                        error={!!errors.age}
                                        helperText={errors.age}
                                        value={user.age}
                                        onChange={handleInputChange}
                                    />
                                    <Button
                                        style={{ marginRight: '10px', width: '12vw' }}
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={handleSaveClick}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        style={{ marginLeft: '10px', width: '6vw' }}
                                        variant="outlined"
                                        color="primary"
                                        className={classes.editButton}
                                        onClick={handleClose}
                                    >
                                        Close
                                    </Button>
                                </>
                            )}
                            {(!editMode && !editPasswordMode) && (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                                    <Button
                                        style={{ marginLeft: '10px', width: '15vw' }}
                                        variant="outlined"
                                        color="primary"
                                        className={classes.editButton}
                                        onClick={handleEditClick}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </Paper>
                    </Grid>
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
            </> :
            <>
                {(prevPage === 'users')? <UserManagement /> : <AssignManager />}
            </>
    );
};

export default ProfileView;