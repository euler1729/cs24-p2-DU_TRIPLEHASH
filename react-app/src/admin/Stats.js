import React from 'react';
import { Typography, Grid, Paper, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: theme.palette.background.paper,
    height: '20vh'
  },
  statisticTitle: {
    marginBottom: theme.spacing(2),
  },
}));

const StatisticsPage = () => {
  const classes = useStyles();

  // Mock data
  const statisticsData = {
    activeTrips: 15,
    availableTruck: 8,
    landfillOperations: 3,
    stsManagerStats: {
      total: 5,
      completed: 3,
      pending: 2,
    },
    vehicleStats: {
      total: 20,
      operational: 15,
      underMaintenance: 3,
      outOfService: 2,
    },
    monthlyRevenue: 25000,
    totalUsers: 150,
    activeUsers: 120,
    pendingRequests: 15,
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#ffcc80' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Active Trips</Typography>
            <Typography variant="h4">{statisticsData.activeTrips}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#81c784' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Available Truck</Typography>
            <Typography variant="h4">{statisticsData.availableTruck}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#64b5f6' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Landfill Operations</Typography>
            <Typography variant="h4">{statisticsData.landfillOperations}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#ffb74d' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Monthly Revenue</Typography>
            <Typography variant="h4">${statisticsData.monthlyRevenue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#aed581' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Total Users</Typography>
            <Typography variant="h4">{statisticsData.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#90a4ae' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Active Users</Typography>
            <Typography variant="h4">{statisticsData.activeUsers}</Typography>
          </Paper>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#ff8a65' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Pending Requests</Typography>
            <Typography variant="h4">{statisticsData.pendingRequests}</Typography>
          </Paper>
        </Grid> */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#f06292' }}>
            <Typography variant="h6" className={classes.statisticTitle}>STS Manager Stats</Typography>
            <Typography variant="body1">Total: {statisticsData.stsManagerStats.total}</Typography>
            <Typography variant="body1">Completed: {statisticsData.stsManagerStats.completed}</Typography>
            <Typography variant="body1">Pending: {statisticsData.stsManagerStats.pending}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper} style={{ background: '#4db6ac' }}>
            <Typography variant="h6" className={classes.statisticTitle}>Vehicle Stats</Typography>
            <Typography variant="body1">Total: {statisticsData.vehicleStats.total}</Typography>
            <Typography variant="body1">Operational: {statisticsData.vehicleStats.operational}</Typography>
            <Typography variant="body1">Under Maintenance: {statisticsData.vehicleStats.underMaintenance}</Typography>
            <Typography variant="body1">Out of Service: {statisticsData.vehicleStats.outOfService}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default StatisticsPage;
