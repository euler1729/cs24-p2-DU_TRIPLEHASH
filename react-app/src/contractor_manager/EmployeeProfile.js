import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  makeStyles,
  Avatar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  TextField,
  TableHead,
} from "@material-ui/core";
import api from "../API";
import Cookies from "universal-cookie";
import EcoSyncBrand from "../EcoSyncBrand/EcoSyncBrand.json";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: "70vw",
    margin: "auto",
    backgroundColor: EcoSyncBrand.Colors.background,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    backgroundColor: EcoSyncBrand.Colors.green,
    color: EcoSyncBrand.Colors.greenWhite,
    margin: "auto",
  },
  profileBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: EcoSyncBrand.Colors.lightBackground,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],

  },
  profileInfo: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    color: EcoSyncBrand.Colors.greenTeaDark,
    marginBottom: theme.spacing(1),
  },
  info: {
    color: EcoSyncBrand.Colors.textPrimary,
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
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
  backButton: {
    marginBottom: theme.spacing(2),
    color: EcoSyncBrand.Colors.green,
    "&:hover": {
      backgroundColor: EcoSyncBrand.Colors.greenLight,
    },
  },
  dateField: {
    margin: theme.spacing(2, 0),
  },
  table: {
    minWidth: 300,
    marginBottom: theme.spacing(2),
    
  },
  smallTable: {
    height: "50px",
    maxHeight: "50px",
    borderRadius: '20px',
    border: '20px opacity',
    alignContent: 'center',
    
  },
  infoCell: {
    fontSize: '0.9rem',
    height: '1px',
  },
}));

const EmployeeProfile = ({ employee, setSelectedEmployee }) => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/employees/${employee.employee_id}/logs`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("access_token")}`,
            },
            withCredentials: true,
            params: { date: selectedDate },
          }
        );
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLoading(false);
      }
    };

    if (employee) fetchLogs();
  }, [employee, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className={classes.root}>
      <Button className={classes.backButton} onClick={() => setSelectedEmployee(null)}>
        Back to Employee List
      </Button>
      <Grid container direction="column" alignItems="center" className={classes.profileBox}>
        <Avatar className={classes.avatar}>{employee.full_name.charAt(0)}</Avatar>
        <div className={classes.profileInfo}>
          <TableContainer component={Paper}>
            <Table style={{color: 'blue', height: '200px'}}>
              <TableBody style={{height: 50, color: 'white'}}>
                {[
                  ["ID", employee.employee_id],
                  ["Name", employee.full_name],
                  ["Date of Birth", employee.dob],
                  ["Joined", employee.date_of_hire],
                  ["Title", employee.job_title],
                  ["Payment Rate/Hour", employee.payment_rate_per_hour],
                  ["Contact", employee.contact],
                  ["Route", employee.assigned_collection_route],
                ].map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell><strong>{label}:</strong></TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        className={classes.dateField}
      />
      {loading ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Date", "Log-in Time", "Log-out Time", "Total Hours Worked", "Overtime Hours", "Absences and Leaves"].map((header) => (
                  <TableCell key={header} className={classes.headerCell}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.date}
                  onClick={() => handleLogClick(log)}
                  style={{ cursor: "pointer" }}
                  selected={selectedLog && selectedLog.date === log.date}
                >
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.log_in_time}</TableCell>
                  <TableCell>{log.log_out_time}</TableCell>
                  <TableCell>{log.total_hours_worked}</TableCell>
                  <TableCell>{log.overtime_hours}</TableCell>
                  <TableCell>{log.absences_and_leaves}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedLog && (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Task", "Start Time", "End Time"].map((header) => (
                  <TableCell key={header} className={classes.headerCell}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLog.tasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.task_name}</TableCell>
                  <TableCell>{task.start_time}</TableCell>
                  <TableCell>{task.end_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default EmployeeProfile;
