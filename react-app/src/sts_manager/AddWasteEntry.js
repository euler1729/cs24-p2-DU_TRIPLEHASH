import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EcoBrand from "../EcoSyncBrand/EcoSyncBrand.json";
import api from "../API";
import Cookies from 'universal-cookie';


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
    backgroundColor: EcoBrand.Colors.greenWhite,
    marginTop: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
  },
  formControl: {
    margin: theme.spacing(2),
    width: "100%",
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const wasteTypes = [
  { value: "Domestic", label: "Domestic" },
  { value: "Plastic", label: "Plastic" },
  { value: "Construction Waste", label: "Construction Waste" },
];

const AddWasteEntry = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    contractorId: "",
    wasteType: "",
    sts: "",
    vehicle: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)
    
    try  {
      await api.post(
        "/contractor",
        { formData },
        {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Adding Waste Error:", error);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h5">Add Waste Entry</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.formControl}
          label="Time and Date of Collection"
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          className={classes.formControl}
          label="Amount of Waste Collected (kg)"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <TextField
          className={classes.formControl}
          label="Contractor ID"
          name="contractorId"
          value={formData.contractorId}
          onChange={handleChange}
          required
        />
        <TextField
          className={classes.formControl}
          select
          label="Type of Waste Collected"
          name="wasteType"
          value={formData.wasteType}
          onChange={handleChange}
          required
        >
          {wasteTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.formControl}
          label="Designated STS for Deposit"
          name="sts"
          value={formData.sts}
          onChange={handleChange}
          required
        />
        <TextField
          className={classes.formControl}
          label="Vehicle Used for Transportation"
          name="vehicle"
          value={formData.vehicle}
          onChange={handleChange}
          required
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddWasteEntry;
