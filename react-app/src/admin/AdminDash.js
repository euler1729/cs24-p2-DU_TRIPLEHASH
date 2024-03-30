import React, { useState } from 'react';
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, Dashboard, People, BarChart, ExitToApp, PersonAdd, Edit, Settings, PlaylistAddm, AccountBox, ExpandLess, ExpandMore } from '@material-ui/icons';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import WarehouseIcon from '@mui/icons-material/Warehouse';


import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

// Brand
import LogGif from '../EcoSyncBrand/logogif.gif'
import EcoBrand from '../EcoSyncBrand/EcoSyncBrand.json'

// PNG ICONS
import stsicon from './res/sts.png'
import landfillicon from './res/landfill.png'
import stsmanager from './res/stsmanager.png'
import landfillmanager from './res/landfillmanager.png'

// Component for Admin Dashboard
import UserManagement from './UserManagement';
import CreateUser from './CreateUser';
import ProfileView from '../general/ProfileView';
import VehiclePage from './AddVechicle';
import CreateSTSPage from './CreateSTS';
import CreateLandfill from './CreateLandfill';
import AssignManager from './AssignManager';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',

  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    overflowY: 'hidden',
  },
  drawerPaper: {
    width: drawerWidth,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar
    },
  },
  logo: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'white',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    margin: 'auto',
    height: '100vw',
    backgroundColor: EcoBrand.Colors.greenWhite,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  list:{  
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  list2:{
    alignSelf: 'flex-end',
    marginTop: 'auto',
  }
}));

function AdminDashboard() {
  const classes = useStyles();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [open, setOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    cookies.remove('access_token ');
    navigate('/');
  }

  const handleSubOptionClick = () => {
    setOpen(!open);
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <Typography variant="h4">Welcome to Admin Dashboard</Typography>;
      case 'users':
        return <UserManagement />;
      case 'createUser':
        return <CreateUser />;
      case 'profile':
        return <ProfileView />;
      case 'addVehicle':
        return <VehiclePage />;
      case 'createSTS':
        return <CreateSTSPage />;
      case 'createLandfill':
        return <CreateLandfill />;
      case 'assignSTSManager':
        return <AssignManager />;

      // Add cases for other options
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <div classes={classes.drawerPaper}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* LOGO */}
            <div className={classes.logo}>
              <Typography variant="h6">
                <img src={LogGif} alt="EcoSync Logo" style={{ width: '80%' }} />
              </Typography>
            </div>

            <div className={classes.list}>
              <div className={classes.list1}>
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
                  <ListItem button onClick={() => handleOptionClick('addVehicle')}>
                    <ListItemIcon><FireTruckIcon /></ListItemIcon>
                    <ListItemText primary="Add Vehicle" />
                  </ListItem>


                  <ListItem button onClick={handleSubOptionClick}>
                    <ListItemIcon>
                      <img src={stsmanager} alt="STS Manager Icon" style={{ width: '20px' }} />
                    </ListItemIcon>
                    <ListItemText primary="Managers" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('createLandfill')}>
                      <ListItemIcon>
                        <img src={landfillicon} alt="Landfill Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Create Landfill" />
                    </ListItem>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('createSTS')}>
                      <ListItemIcon>
                        <img src={stsicon} alt="STS Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Create STS" />
                    </ListItem>
                    <List component="div" disablePadding>
                      <ListItem button className={classes.nested}>
                        <ListItemIcon>
                          <img src={landfillmanager} alt="Manager Icon" style={{ width: '20px' }} />
                        </ListItemIcon>
                        <ListItemText primary="Assign Manager" onClick={() => handleOptionClick('assignSTSManager')} />
                      </ListItem>
                    </List>
                  </Collapse>
                </List>
              </div>

              <div className={classes.list2}>
                <List>
                  <ListItem button onClick={() => handleOptionClick('profile')}>
                    <ListItemIcon><AccountBox /></ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem button onClick={() => handleLogout()}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </div>
            </div>
          </div>
        </Drawer>
      </div>

      <div className={classes.content}>
        <div className={classes.toolbar} />
        {renderComponent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
