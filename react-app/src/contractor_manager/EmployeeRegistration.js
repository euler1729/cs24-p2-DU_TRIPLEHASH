import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  makeStyles,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import api from "../API";
import Cookies from "universal-cookie";
import EcoSyncBrand from "../EcoSyncBrand/EcoSyncBrand.json";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90vh",
    width: "75vw",
    margin: "auto",
  },
  title: {
    fontWeight: "bold",
    color: EcoSyncBrand.Colors.greenTeaDark,
  },
  paper: {
    padding: theme.spacing(3),
    backgroundColor: "#f5f5f5",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  form: {
    "& > *": {
      marginBottom: theme.spacing(2),
      width: "100%",
      backgroundColor: EcoSyncBrand.Colors.greenWhite,
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
    color: EcoSyncBrand.Colors.green,
    backgroundColor: EcoSyncBrand.Colors.greenWhite,
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: EcoSyncBrand.Colors.green,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: EcoSyncBrand.Colors.green,
    },
  },
  button: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
    color: EcoSyncBrand.Colors.greenWhite,
    backgroundColor: EcoSyncBrand.Colors.green,
    "&:hover": {
      backgroundColor: EcoSyncBrand.Colors.greenTeaDark,
    },
  },
  circularProgress: {
    color: EcoSyncBrand.Colors.greenWhite,
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  },
}));

const EmployeeRegistration = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState(""); // success or error
  const [employee, setEmployee] = useState({
    employee_id: "",
    full_name: "",
    date_of_birth: "",
    date_of_hire: "",
    job_title: "",
    payment_rate_per_hour: "",
    contact_information: "",
    assigned_collection_route: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    setErrors({});

    const newErrors = {};
    if (!employee.employee_id)
      newErrors.employee_id = "Employee ID is required";
    if (!employee.full_name) newErrors.full_name = "Full Name is required";
    if (!employee.date_of_birth)
      newErrors.date_of_birth = "Date of Birth is required";
    if (!employee.date_of_hire)
      newErrors.date_of_hire = "Date of Hire is required";
    if (!employee.job_title) newErrors.job_title = "Job Title is required";
    if (!employee.payment_rate_per_hour)
      newErrors.payment_rate_per_hour = "Payment Rate per Hour is required";
    if (!employee.contact_information)
      newErrors.contact_information = "Contact Information is required";
    if (!employee.assigned_collection_route)
      newErrors.assigned_collection_route =
        "Assigned Collection Route is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setLoading(true);
    try {
      api
        .post("/employees/register", employee, {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setDialogType("success");
          setDialogMessage("Employee registered successfully");
          setDialogOpen(true);
          setEmployee({
            employee_id: "",
            full_name: "",
            date_of_birth: "",
            date_of_hire: "",
            job_title: "",
            payment_rate_per_hour: "",
            contact_information: "",
            assigned_collection_route: "",
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setDialogType("error");
          setDialogMessage(
            err?.response?.data?.error || "Failed to register employee"
          );
          setDialogOpen(true);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setDialogType("error");
      setDialogMessage("Failed to register employee");
      setDialogOpen(true);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" gutterBottom className={classes.title}>
              Register New Employee
            </Typography>
            <form className={classes.form}>
              <TextField
                name="employee_id"
                className={classes.textField}
                label="Employee ID"
                variant="outlined"
                value={employee.employee_id}
                onChange={(e) =>
                  setEmployee({ ...employee, employee_id: e.target.value })
                }
                error={!!errors.employee_id}
                helperText={errors.employee_id}
              />
              <TextField
                name="full_name"
                className={classes.textField}
                label="Full Name"
                variant="outlined"
                value={employee.full_name}
                onChange={(e) =>
                  setEmployee({ ...employee, full_name: e.target.value })
                }
                error={!!errors.full_name}
                helperText={errors.full_name}
              />
              <TextField
                name="date_of_birth"
                className={classes.textField}
                label="Date of Birth"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={employee.date_of_birth}
                onChange={(e) =>
                  setEmployee({ ...employee, date_of_birth: e.target.value })
                }
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
              />
              <TextField
                name="date_of_hire"
                className={classes.textField}
                label="Date of Hire"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={employee.date_of_hire}
                onChange={(e) =>
                  setEmployee({ ...employee, date_of_hire: e.target.value })
                }
                error={!!errors.date_of_hire}
                helperText={errors.date_of_hire}
              />
              <TextField
                name="job_title"
                className={classes.textField}
                label="Job Title"
                variant="outlined"
                value={employee.job_title}
                onChange={(e) =>
                  setEmployee({ ...employee, job_title: e.target.value })
                }
                error={!!errors.job_title}
                helperText={errors.job_title}
              />
              <TextField
                name="payment_rate_per_hour"
                className={classes.textField}
                label="Payment Rate per Hour"
                variant="outlined"
                type="number"
                value={employee.payment_rate_per_hour}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    payment_rate_per_hour: e.target.value,
                  })
                }
                error={!!errors.payment_rate_per_hour}
                helperText={errors.payment_rate_per_hour}
              />
              <TextField
                name="contact_information"
                className={classes.textField}
                label="Contact Information"
                variant="outlined"
                value={employee.contact_information}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    contact_information: e.target.value,
                  })
                }
                error={!!errors.contact_information}
                helperText={errors.contact_information}
              />
              <TextField
                name="assigned_collection_route"
                className={classes.textField}
                label="Assigned Collection Route"
                variant="outlined"
                value={employee.assigned_collection_route}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    assigned_collection_route: e.target.value,
                  })
                }
                error={!!errors.assigned_collection_route}
                helperText={errors.assigned_collection_route}
              />
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                {loading ? "Registering..." : "Register Employee"}
                {loading && (
                  <CircularProgress
                    size={20}
                    className={classes.circularProgress}
                  />
                )}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle
          color={
            dialogType === "success" ? EcoSyncBrand.Colors.green : "secondary"
          }
        >
          {dialogType === "success" ? "Success" : "Failure"}
        </DialogTitle>
        <DialogContent
          color={
            dialogType === "success" ? EcoSyncBrand.Colors.green : "secondary"
          }
        >
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            color={
              dialogType === "success" ? EcoSyncBrand.Colors.green : "secondary"
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeRegistration;
