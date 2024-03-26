import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, Dashboard, People, BarChart } from '@material-ui/icons';

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
        <div className={classes.toolbar} />
        <List>
          <ListItem button>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><People /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          {/* <ListItem button>
            <ListItemIcon><ContentCopy /></ListItemIcon>
            <ListItemText primary="Content" />
          </ListItem> */}
          <ListItem button>
            <ListItemIcon><BarChart /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* Add your dashboard content here */}
        <Typography variant="h4">Welcome to Admin Dashboard</Typography>
      </main>
    </div>
  );
}

export default AdminDashboard;
