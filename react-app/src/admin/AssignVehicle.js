import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, InputAdornment, IconButton, Typography, FormControl, Select, MenuItem } from '@material-ui/core';
import { Search, FilterList } from '@material-ui/icons';

// Sample truck data
const truckData = [
  { registrationNumber: 'ABC123', truckType: 'Semi-trailer', capacity: '30 tons', loadedCostPerKm: '$0.50', unloadedCostPerKm: '$0.30', assignedSTS: 'STS Facility 1' },
  { registrationNumber: 'XYZ456', truckType: 'Flatbed', capacity: '25 tons', loadedCostPerKm: '$0.60', unloadedCostPerKm: '$0.35', assignedSTS: 'STS Facility 2' },
  // Add more truck data as needed
];

const AssignVehicle = () => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <Typography variant="h5">Truck List</Typography>
      <FormControl style={{ marginBottom: 16 }}>
        <TextField
          variant="outlined"
          label="Search"
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <FormControl style={{ marginBottom: 16 }}>
        <Select
          variant="outlined"
          value={''}
          displayEmpty
          onChange={() => {}}
          startAdornment={<FilterList />}
        >
          <MenuItem value="">Filter by Truck Type</MenuItem>
          <MenuItem value="Semi-trailer">Semi-trailer</MenuItem>
          <MenuItem value="Flatbed">Flatbed</MenuItem>
          {/* Add more truck types as needed */}
        </Select>
      </FormControl>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Registration Number</TableCell>
            <TableCell>Truck Type</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Cost Per Km (Loaded)</TableCell>
            <TableCell>Cost Per Km (Unloaded)</TableCell>
            <TableCell>Assigned STS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {truckData.map((truck, index) => (
            <TableRow key={index}>
              <TableCell>{truck.registrationNumber}</TableCell>
              <TableCell>{truck.truckType}</TableCell>
              <TableCell>{truck.capacity}</TableCell>
              <TableCell>{truck.loadedCostPerKm}</TableCell>
              <TableCell>{truck.unloadedCostPerKm}</TableCell>
              <TableCell>{truck.assignedSTS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignVehicle;
