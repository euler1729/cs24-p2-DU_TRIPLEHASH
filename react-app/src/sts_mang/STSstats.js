import React from 'react';
import { Typography, Grid, Paper, makeStyles } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';


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
    height: '20vh',

  },
  chartContainer: {
    marginTop: theme.spacing(3),
  },
}));

const STSManagerStatisticsPage = () => {
  const classes = useStyles();

  // Mock data for STS statistics
  const stsStatisticsData = {
    fleetInformation: {
      totalVehicles: 25,
      operationalVehicles: 20,
      underMaintenance: 3,
      outOfService: 2,
    },
    activeVehicles: 18,
    availableVehicles: 7,
    dailyWasteAmount: [
      { date: '2024-02-01', amount: 300 },
      { date: '2024-02-02', amount: 350 },
      { date: '2024-02-03', amount: 400 },
      { date: '2024-02-04', amount: 380 },
      { date: '2024-02-05', amount: 420 },
      { date: '2024-02-06', amount: 390 },
      { date: '2024-02-07', amount: 410 },
      { date: '2024-02-08', amount: 380 },
      { date: '2024-02-09', amount: 420 },
      { date: '2024-02-10', amount: 400 },
      { date: '2024-02-11', amount: 430 },
      { date: '2024-02-12', amount: 450 },
      { date: '2024-02-13', amount: 470 },
      { date: '2024-02-14', amount: 490 },
      { date: '2024-02-15', amount: 500 },
      { date: '2024-02-16', amount: 520 },
      { date: '2024-02-17', amount: 540 },
      { date: '2024-02-18', amount: 560 },
      { date: '2024-02-19', amount: 580 },
      { date: '2024-02-20', amount: 600 },
      { date: '2024-02-21', amount: 620 },
      { date: '2024-02-22', amount: 640 },
      { date: '2024-02-23', amount: 660 },
      { date: '2024-02-24', amount: 680 },
      { date: '2024-02-25', amount: 700 },
      { date: '2024-02-26', amount: 720 },
      { date: '2024-02-27', amount: 740 },
      { date: '2024-02-28', amount: 760 },
    ],
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        STS Manager Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper} style={{ background: '#81c784' }}>
            <Typography variant="h6">Fleet Information</Typography>
            <Typography>Total Vehicles: {stsStatisticsData.fleetInformation.totalVehicles}</Typography>
            <Typography>Operational Vehicles: {stsStatisticsData.fleetInformation.operationalVehicles}</Typography>
            <Typography>Under Maintenance: {stsStatisticsData.fleetInformation.underMaintenance}</Typography>
            <Typography>Out of Service: {stsStatisticsData.fleetInformation.outOfService}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper} style={{ background: '#64b5f6' }}>
            <Typography variant="h6">Active Vehicles</Typography>
            <Typography>{stsStatisticsData.activeVehicles}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper} style={{ background: '#ffb74d' }}>
            <Typography variant="h6">Available Vehicles</Typography>
            <Typography>{stsStatisticsData.availableVehicles}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Paper className={classes.paper} style={{ background: '#f06292', height: '30vh', background: EcoSyncBrand.Colors.greenWhite}}>
            <Typography variant="h6">Daily Waste Amount(TONS)</Typography>
            <div className={classes.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stsStatisticsData.dailyWasteAmount}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default STSManagerStatisticsPage;
