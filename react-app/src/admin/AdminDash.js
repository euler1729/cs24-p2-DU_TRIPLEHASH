import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, Dashboard, People, BarChart, ExitToApp, PersonAdd, Edit, Settings, PlaylistAdd } from '@material-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function AdminDashboard() {
  const classes = useStyles();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [selectedOption, setSelectedOption] = useState('dashboard');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    cookies.remove('access_token ');
    navigate('/');
  }

  const renderComponent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <Typography variant="h4">Welcome to Admin Dashboard</Typography>;
      case 'users':
        return <Typography variant="h4">Users Component</Typography>;
      case 'createUser':
        return <Typography variant="h4">Create New User Component</Typography>;
      case 'updateUser':
        return <Typography variant="h4">Update User Information Component</Typography>;
      // Add cases for other options
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Admin Dashboard</Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar}>
          <Typography variant="h6">Your Logo</Typography>
        </div>
        <List>
          <ListItem button onClick={() => handleOptionClick('dashboard')}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleOptionClick('users')}>
            <ListItemIcon><People /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => handleOptionClick('createUser')}>
            <ListItemIcon><PersonAdd /></ListItemIcon>
            <ListItemText primary="Create New User" />
          </ListItem>
          <ListItem button onClick={() => handleOptionClick('updateUser')}>
            <ListItemIcon><Edit /></ListItemIcon>
            <ListItemText primary="Update User Information" />
          </ListItem>
          {/* Add other menu items with onClick handlers */}
        </List>
        <div style={{ flexGrow: 1 }} />
        <List>
          <ListItem button onClick={() => handleLogout()}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* Render selected component */}
        {renderComponent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
