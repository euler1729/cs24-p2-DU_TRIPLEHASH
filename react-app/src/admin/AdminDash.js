import React, { useState } from 'react';
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Dashboard, People, ExitToApp, PersonAdd, AccountBox, ExpandLess, ExpandMore } from '@material-ui/icons';
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';


import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

// Brand
import LogGif from '../EcoSyncBrand/logogif.gif'
import EcoBrand from '../EcoSyncBrand/EcoSyncBrand.json'

// PNG ICONS
import stsicon from './res/sts.png'
import landfillicon from './res/landfill.png'
import stsman from './res/stsman.png'
import managers from './res/managers.png'
import assignmanager from './res/assignmanager.png'
import addtruck from './res/addtruck.png'
import choosecar from './res/choosecar.png'


// Component for Admin Dashboard
import UserManagement from './UserManagement';
import CreateUser from './CreateUser';
import ProfileView from '../general/ProfileView';
import VehiclePage from './AddVechicle';
import CreateSTSPage from './CreateSTS';
import CreateLandfill from './CreateLandfill';
import AssignManager from './AssignManager';
import AssignVehicle from './AssignVehicle';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',

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
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  list1: {
    // height: '100%',
  },
  list2: {
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
  const [truckOpen, setTruckOpen] = useState(false);

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
  const handleTruckOptionClick = () => {
    setTruckOpen(!truckOpen);
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
      case 'assignManager':
        return <AssignManager />;
      case 'assignVehicle':
        return <AssignVehicle />;


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
                  <ListItem button onClick={handleSubOptionClick}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('createUser')}>
                      <ListItemIcon><PersonAdd /></ListItemIcon>
                      <ListItemText primary="Create New User" />
                    </ListItem>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('createLandfill')}>
                      <ListItemIcon>
                        <img src={landfillicon} alt="Landfill Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Create Landfill" />
                    </ListItem>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('createSTS')}>
                      <ListItemIcon>
                        <img src={stsman} alt="STS Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Create STS" />
                    </ListItem>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('addVehicle')}>
                      <ListItemIcon>
                        <img src={addtruck} alt="Add Truck Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Add Vehicle" />
                    </ListItem>
                  </Collapse>

                  <ListItem button onClick={handleTruckOptionClick}>
                    <ListItemIcon>
                      <AssignmentTurnedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="Assign" />
                    {truckOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={truckOpen} timeout="auto" unmountOnExit>
                    <ListItem button className={classes.nested} onClick={() => handleOptionClick('assignManager')}>
                      <ListItemIcon>
                        <img src={assignmanager} alt="Manager Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Assign Manager" />
                    </ListItem>
                    <ListItem className={classes.nested} button onClick={() => handleOptionClick('assignVehicle')}>
                      <ListItemIcon>
                        <img src={choosecar} alt="Assign Vehicle Icon" style={{ width: '20px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Assign Vehicle" />
                    </ListItem>
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
