import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import api from "../API";
import EcoSyncBrand from "../EcoSyncBrand/EcoSyncBrand.json";
import Cookies from "universal-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: "80vw",
    margin: "auto",
    backgroundColor: EcoSyncBrand.Colors.background,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  form: {
    marginBottom: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: EcoSyncBrand.Colors.greenTeaDark,
    color: EcoSyncBrand.Colors.greenWhite,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
}));

const CollectionPlanManager = () => {
  const classes = useStyles();
  const [collectionPlans, setCollectionPlans] = useState([]);
  const [formValues, setFormValues] = useState({
    area: "",
    start_time: "",
    duration: "",
    no_labour: "",
    no_vans: "",
    exp_wt: "",
  });
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    
  }, []);

  const fetchCollectionPlans = async () => {
    try {
      api
        .get("/collection", {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.collection);
          setCollectionPlans(res.data.collection);
        });
    } catch (error) {
      console.error("Failed to fetch collection plans:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/collection/${editingPlan.collection_id}`, formValues);
      } else {
        try {
          api
            .post("/collection", formValues, {
              headers: {
                Authorization: `Bearer ${cookies.get("access_token")}`,
              },
              withCredentials: true,
            })
            .then((res) => {
              Dialog("Success");
            });
        } catch (error) {
          console.error("Failed to fetch collection plans:", error);
        }
      }
      setFormValues({
        area: "",
        start_time: "",
        duration: "",
        no_labour: "",
        no_vans: "",
        exp_wt: "",
      });
      setEditingPlan(null);
      fetchCollectionPlans();
    } catch (error) {
      console.error("Failed to save collection plan:", error);
    }
  };

  const handleEdit = (plan) => {
    setFormValues(plan);
    setEditingPlan(plan);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      api
        .delete(`/collection/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          Dialog("Success");
        });
    } catch (error) {
      console.log(id)
      console.error("Failed to fetch collection plans:", error);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Collection Plan Manager
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Area of Collection"
              name="area"
              value={formValues.area}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Collection Start Time"
              type="time"
              name="start_time"
              value={formValues.start_time}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration for Collection (hours)"
              type="number"
              name="duration"
              value={formValues.duration}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Laborers"
              type="number"
              name="no_labour"
              value={formValues.no_labour}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Vans"
              type="number"
              name="no_vans"
              value={formValues.no_vans}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Expected Weight of Daily Solid Waste (kg)"
              type="number"
              name="exp_wt"
              value={formValues.exp_wt}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {editingPlan ? "Update Plan" : "Add Plan"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>Area</TableCell>
              <TableCell className={classes.headerCell}>Start Time</TableCell>
              <TableCell className={classes.headerCell}>Duration</TableCell>
              <TableCell className={classes.headerCell}>Laborers</TableCell>
              <TableCell className={classes.headerCell}>Vans</TableCell>
              <TableCell className={classes.headerCell}>
                Expected Weight
              </TableCell>
              <TableCell className={classes.headerCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionPlans.map((plan) => (
              <TableRow key={plan.collection_id}>
                <TableCell>{plan.area}</TableCell>
                <TableCell>{plan.start_time}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>{plan.no_labour}</TableCell>
                <TableCell>{plan.no_vans}</TableCell>
                <TableCell>{plan.exp_wt}</TableCell>
                <TableCell>
                  <IconButton
                    className={classes.actionButton}
                    onClick={() => handleEdit(plan)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.actionButton}
                    onClick={() => handleDelete(plan.collection_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{editingPlan ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <DialogContent>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Area of Collection"
                  name="area"
                  value={formValues.area}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Collection Start Time"
                  type="time"
                  name="startTime"
                  value={formValues.start_time}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration for Collection (hours)"
                  type="number"
                  name="duration"
                  value={formValues.duration}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Laborers"
                  type="number"
                  name="laborers"
                  value={formValues.laborers}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Vans"
                  type="number"
                  name="no_vans"
                  value={formValues.no_vans}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Expected Weight of Daily Solid Waste (kg)"
                  type="number"
                  name="exp_wt"
                  value={formValues.exp_wt}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingPlan ? "Update Plan" : "Add Plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CollectionPlanManager;
