import React, { useState } from 'react';
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Dashboard, People, ExitToApp, PersonAdd, AccountBox, ExpandLess, ExpandMore, Create, Looks } from '@material-ui/icons';


import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

// Brand
import LogGif from '../EcoSyncBrand/logogif.gif'
import EcoBrand from '../EcoSyncBrand/EcoSyncBrand.json'

import EmployeeRegistration from './EmployeeRegistration';
import EmployeeList from './EmployeeList';
import Monitor from './Monitor'
import CollectionPlanManager from './CollectionPlanManager'
import Profile from '../general/ProfileView'
import Tracker from './Tracker';

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
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  list2: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  }
}));

function STSManagerDashboard() {
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
    cookies.remove('access_token', { path: '/' });
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
        return <Tracker />;
      case 'contractor dashboard':
        return <EmployeeRegistration />;
      case 'employee registration':
        return <EmployeeRegistration />;
      case 'employee list':
        return <EmployeeList />;
      case 'create collection':
        return <CollectionPlanManager />
      case 'profile':
        return <Profile />;
        


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
                    <ListItemIcon><Looks /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>

                  <ListItem button onClick={() => handleOptionClick('employee list')}>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary="Employee List" />
                  </ListItem>

                  <ListItem button onClick={() => handleOptionClick('employee registration')}>
                    <ListItemIcon><PersonAdd /></ListItemIcon>
                    <ListItemText primary="Employee Registration" />
                  </ListItem>

                  <ListItem button onClick={() => handleOptionClick('create collection')}>
                    <ListItemIcon><Create /></ListItemIcon>
                    <ListItemText primary="Create collection" />
                  </ListItem>

                 

                  <ListItem>

                  </ListItem>
                 
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

export default STSManagerDashboard;
