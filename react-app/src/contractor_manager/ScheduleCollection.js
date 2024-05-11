import React, { useState, useCallback } from "react";
import {
  Typography,
  Paper,
  makeStyles,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import API from "../API";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: "60vw",
    margin: "auto",
    backgroundColor: "#f5f5f5",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  form: {
    marginBottom: theme.spacing(3),
    "& > *": {
      margin: theme.spacing(1, 0),
    },
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#4caf50",
    color: "#ffffff",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  mapContainer: {
    height: "400px",
    width: "100%",
    marginTop: theme.spacing(3),
  },
}));

const neighborhoodSets = [
  ['Chakharpul', 'Medical Front', 'Buet', 'Doel Chattar', 'Bongobazar'],
  ['Science Lab', 'New Market', 'Dhanmondi 9', 'Bata Signal', 'Kalabagan'],
  ['Pallabi', 'Mirpur 11', 'Mirpur 12 Bus stand', 'BUP Gate', 'Mist Gate'],
  ['Kallyanpur', 'Technical', 'Darussalam', 'Majar Roadd',],
  ['Agargao', 'Bijoy Sharani', 'Tejkunipara', 'Kazipara', 'Shewrapara'],
];

const getRandomNeighborhoods = (neighborhoods, count) => {
  const shuffled = [...neighborhoods].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Define libraries outside of the component to avoid reloading
const libraries = ["places"];

const ScheduleCollection = () => {
  const classes = useStyles();
  const [sts, setSts] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [lastTime, setLastTime] = useState("");
  const [numVans, setNumVans] = useState("");
  const [vanCapacity, setVanCapacity] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB1HyhM-zUAmxq3USoPS-qb2MmJu1pUu70", // Replace with your API key
    libraries,
  });

  const handleGenerateSchedule = () => {
    const vans = Array.from({ length: numVans }, (_, i) => `Van ${i + 1}`);
    const assignments = vans.map((van) => {
      const vanNeighborhoods = getRandomNeighborhoods(
        neighborhoods,
        Math.floor(Math.random() * neighborhoods.length) + 1
      );
      const route = [sts, ...vanNeighborhoods, sts];
      const totalWeight =
        vanNeighborhoods.length * (vanCapacity / neighborhoods.length);
      return {
        van,
        route,
        totalWeight,
      };
    });

    setSchedule(assignments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerateSchedule();
    try {
      API.get('/contractor', {}, {

      })
    } catch (e) {
      console.log('Errro');
    }
  };

  const handleStsChange = (e) => {
    const stsValue = e.target.value;
    setSts(stsValue);
    setNeighborhoods(neighborhoodSets[stsValue % 5]);
  };

  const handleRowClick = useCallback((route) => {
    route[0] = "Dhaka Uni";
    route[route.length - 1] = "Dhaka Uni";
    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = route
      .slice(1, -1)
      .map((location) => ({ location, stopover: true }));
    directionsService.route(
      {
        origin: route[0],
        destination: route[route.length - 1],
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setSelectedRoute(result);
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Schedule Collection
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="STS"
          value={sts}
          onChange={handleStsChange}
          fullWidth
          required
        />
        <Autocomplete
          multiple
          options={neighborhoodSets[sts % 5] || []}
          value={neighborhoods}
          onChange={(event, newValue) => setNeighborhoods(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Neighborhoods"
              placeholder="Add Neighborhood"
              fullWidth
            />
          )}
        />
        <TextField
          label="Last Collection Time"
          type="time"
          value={lastTime}
          onChange={(e) => setLastTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />
        <TextField
          label="Number of Vans"
          type="number"
          value={numVans}
          onChange={(e) => setNumVans(Number(e.target.value))}
          fullWidth
          required
        />
        <TextField
          label="Capacity per Van (kg)"
          type="number"
          value={vanCapacity}
          onChange={(e) => setVanCapacity(Number(e.target.value))}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Generate Schedule
        </Button>
      </form>
      {schedule.length > 0 && (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Van", "Route", "Total Weight (kg)"].map((header) => (
                  <TableCell key={header} className={classes.headerCell}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map(({ van, route, totalWeight }, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(route)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{van}</TableCell>
                  <TableCell>{route.join(", ")}</TableCell>
                  <TableCell>{totalWeight.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isLoaded && selectedRoute && (
        <div className={classes.mapContainer}>
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{ lat: 23.8103, lng: 90.4125 }}
            zoom={12}
          >
            <DirectionsRenderer directions={selectedRoute} />
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default ScheduleCollection;



// route[0] = 'Dhaka Uni';
// route[route.length - 1] = 'Dhaka Uni';
