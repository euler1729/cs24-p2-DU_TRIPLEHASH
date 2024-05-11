import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  makeStyles,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: '80vw',
    margin: 'auto',
    backgroundColor: '#f5f5f5',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#4caf50',
    color: '#ffffff',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const demoData = [
  {
    id: 1,
    collectionDateTime: '2023-05-01T08:00',
    amountCollected: '500',
    contractorId: 'C001',
    wasteType: 'Domestic',
    designatedSts: 'STS1',
    vehicleUsed: 'Truck A',
  },
  {
    id: 2,
    collectionDateTime: '2023-05-02T09:00',
    amountCollected: '1200',
    contractorId: 'C002',
    wasteType: 'Plastic',
    designatedSts: 'STS2',
    vehicleUsed: 'Truck B',
  },
  // Add more demo data as needed
];

const WasteMonitoring = () => {
  const classes = useStyles();
  const [entries, setEntries] = useState(demoData);

  const handleAccept = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    // Add logic to handle acceptance, such as sending a request to the server
    console.log(`Accepted entry with ID: ${id}`);
  };

  const handleReject = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    // Add logic to handle rejection, such as sending a request to the server
    console.log(`Rejected entry with ID: ${id}`);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Monitor Transported Waste
      </Typography>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Time and Date of Collection", "Amount Collected (kg)", "Contractor ID", "Type of Waste Collected", "Designated STS", "Vehicle Used", "Actions"].map((header) => (
                <TableCell key={header} className={classes.headerCell}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.collectionDateTime}</TableCell>
                <TableCell>{entry.amountCollected}</TableCell>
                <TableCell>{entry.contractorId}</TableCell>
                <TableCell>{entry.wasteType}</TableCell>
                <TableCell>{entry.designatedSts}</TableCell>
                <TableCell>{entry.vehicleUsed}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleAccept(entry.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => handleReject(entry.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WasteMonitoring;
