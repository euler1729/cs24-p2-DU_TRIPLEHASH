import React, { useState } from 'react';
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Dashboard, People, ExitToApp, PersonAdd, AccountBox, ExpandLess, ExpandMore } from '@material-ui/icons';


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
import fleet from './res/fleet.png'
import routes from './res/routes.png'
import waste_transfer from './res/waste_transfer.png'
import ActiveTrips from './ActiveTrip';

// Component for Admin Dashboard
// import UserManagement from './UserManagement';
// import CreateUser from './CreateUser';
import ProfileView from '../general/ProfileView';
// import VehiclePage from './AddVechicle';
// import CreateSTSPage from './CreateSTS';
// import CreateLandfill from './CreateLandfill';
// import AssignManager from './AssignManager';
// import AssignVehicle from './AssignVehicle';
import Route from './Route';
import Fleet from './Fleet';
import STSManagerStatisticsPage from './STSstats';
import WasteTransfer from './Waste_transfer';


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
        return <STSManagerStatisticsPage />;
      // case 'users':
      //   return <UserManagement />;
      // case 'createUser':
      //   return <CreateUser />;
      case 'profile':
        return <ProfileView />;
      // case 'addVehicle':
      //   return <VehiclePage />;
      // case 'createSTS':
      //   return <CreateSTSPage />;
      // case 'createLandfill':
      //   return <CreateLandfill />;
      // case 'assignManager':
      //   return <AssignManager />;
      // case 'assignVehicle':
      //   return <AssignVehicle />;
      case 'routes':
        return <Route />;
      case 'fleet' : 
        return <Fleet/>
      case 'Waste Transfer':
        return <WasteTransfer />;
      case 'Active Trips':
        return <ActiveTrips />;
        


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

                  <ListItem button onClick={() => handleOptionClick('Active Trips')}>
                    <ListItemIcon>
                      <img src={waste_transfer} alt="active_trips" style={{ width: '24px',  }} />
                    </ListItemIcon>
                    <ListItemText primary="Trips" />
                  </ListItem>

                  <ListItem button onClick={() => handleOptionClick('Waste Transfer')}>
                    <ListItemIcon>
                      <img src={waste_transfer} alt="waste_transfer" style={{ width: '24px',  }} />
                    </ListItemIcon>
                    <ListItemText primary="Waste Transfer" />
                  </ListItem>

                  <ListItem button onClick={() => handleOptionClick('fleet')}>
                    <ListItemIcon>
                      <img src={fleet} alt="Fleet" style={{ width: '24px' }} />
                    </ListItemIcon>
                    <ListItemText primary="Fleet" />
                  </ListItem>

                  <ListItem button onClick={() => handleOptionClick('routes')}>
                    <ListItemIcon>
                      <img src={routes} alt="Routes" style={{ width: '24px' }} />
                    </ListItemIcon>
                    <ListItemText primary="Routes" />
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