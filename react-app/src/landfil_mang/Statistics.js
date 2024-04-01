import React, { useState } from 'react';
import { Typography, Paper, makeStyles, Button, MenuItem, FormControl, Select, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  chartContainer: {
    marginTop: theme.spacing(4),
  },
}));

const mockStatisticsData = {
  daily: [
    { date: '2024-04-01', vehiclesArrived: 10, vehiclesDeparted: 8, dumpByVehicle: 1200 },
    { date: '2024-04-02', vehiclesArrived: 12, vehiclesDeparted: 9, dumpByVehicle: 1400 },
    { date: '2024-04-03', vehiclesArrived: 8, vehiclesDeparted: 6, dumpByVehicle: 1000 },
    { date: '2024-04-04', vehiclesArrived: 11, vehiclesDeparted: 10, dumpByVehicle: 1350 },
    { date: '2024-04-05', vehiclesArrived: 9, vehiclesDeparted: 7, dumpByVehicle: 1100 },
  ],
  monthly: [
    { month: 'January', vehiclesArrived: 250, vehiclesDeparted: 200, dumpByVehicle: 28000 },
    { month: 'February', vehiclesArrived: 220, vehiclesDeparted: 180, dumpByVehicle: 26000 },
    { month: 'March', vehiclesArrived: 300, vehiclesDeparted: 250, dumpByVehicle: 32000 },
    { month: 'April', vehiclesArrived: 280, vehiclesDeparted: 230, dumpByVehicle: 30000 },
    { month: 'May', vehiclesArrived: 260, vehiclesDeparted: 210, dumpByVehicle: 29000 },
  ],
  yearly: [
    { year: 2021, vehiclesArrived: 3000, vehiclesDeparted: 2500, dumpByVehicle: 320000 },
    { year: 2022, vehiclesArrived: 3200, vehiclesDeparted: 2800, dumpByVehicle: 340000 },
    { year: 2023, vehiclesArrived: 3500, vehiclesDeparted: 3000, dumpByVehicle: 380000 },
    { year: 2024, vehiclesArrived: 3700, vehiclesDeparted: 3200, dumpByVehicle: 400000 },
    { year: 2025, vehiclesArrived: 3900, vehiclesDeparted: 3400, dumpByVehicle: 420000 },
  ],
};

const LandfillStatisticsPage = () => {
  const classes = useStyles();
  const [selectedView, setSelectedView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleViewChange = (event) => {
    setSelectedView(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Landfill Statistics
      </Typography>
      <div style={{display:'flex', flexDirection:'row'}}>
        <Paper className={classes.paper} style={{width:'70px'}}>
            <FormControl variant="outlined" className={classes.formControl}>
            <Select
                value={selectedView}
                onChange={handleViewChange}
            >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
            </FormControl>
        </Paper>
        <Paper className={classes.paper}>
            <TableContainer className={classes.tableContainer}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Date/Year</TableCell>
                    <TableCell>Vehicles Arrived</TableCell>
                    <TableCell>Vehicles Departed</TableCell>
                    <TableCell>Dump by Vehicle</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {mockStatisticsData[selectedView].map((data, index) => (
                    <TableRow key={index}>
                    <TableCell>{selectedView === 'yearly' ? data.year : data.date || data.month}</TableCell>
                    <TableCell>{data.vehiclesArrived}</TableCell>
                    <TableCell>{data.vehiclesDeparted}</TableCell>
                    <TableCell>{data.dumpByVehicle}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
        <div className={classes.chartContainer}>
            <Typography variant="h5" gutterBottom>
            Dump by Vehicle Over Time
            </Typography>
            <LineChart
            width={800}
            height={300}
            data={mockStatisticsData[selectedView]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedView === 'yearly' ? 'year' : selectedView === 'monthly' ? 'month' : 'date'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dumpByVehicle" stroke="#8884d8" />
            </LineChart>
        </div>
      </div>
    </div>
  );
};

export default LandfillStatisticsPage;
