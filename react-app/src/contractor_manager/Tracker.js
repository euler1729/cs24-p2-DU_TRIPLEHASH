import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
} from "@material-ui/core";
import { Edit, Delete, TabUnselected } from "@material-ui/icons";
import api from "../API";
import Cookies from "universal-cookie";
import EcoSyncBrand from "../EcoSyncBrand/EcoSyncBrand.json";
import EmployeeProfile from "./EmployeeProfile";

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
  tableContainer: {
    marginTop: theme.spacing(3),
    maxHeight: "70vh",
  },
  table: {
    minWidth: 650,
  },
  avatar: {
    backgroundColor: EcoSyncBrand.Colors.green,
    color: EcoSyncBrand.Colors.greenWhite,
    textDecoration: "none",
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
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

const Employees = [
  {
    RFID: '123456789',
    loginTime: '2024-05-12 08:30:00',
    logoutTime: '2024-05-12 17:00:00',
    status: 'Cleaned',
    method: 'CCTV',
    requestCheck: false,
    location: 'Main Building'
  },
  {
    RFID: '987654321',
    loginTime: '2024-05-12 09:00:00',
    logoutTime: '2024-05-12 16:30:00',
    status: 'Not Cleaned',
    method: 'MANUAL',
    requestCheck: true,
    location: 'West Wing'
  },
  {
    RFID: '555555555',
    loginTime: '2024-05-12 08:45:00',
    logoutTime: '2024-05-12 17:15:00',
    status: 'Cleaned',
    method: 'CCTV',
    requestCheck: true,
    location: 'East Wing'
  },
  // Add more employee objects as needed
];


const Tracker = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(Employees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [props, setProps] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    // const fetchEmployees = async () => {
    //   try {
    //     const response = await api.get("/contractor/employee", {
    //       headers: {
    //         Authorization: `Bearer ${cookies.get("access_token")}`,
    //       },
    //       withCredentials: true,
    //     });
    //     setEmployees(response.data.employees);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Failed to fetch employees:", error);
    //     setLoading(false);
    //   }
    // };
    // fetchEmployees();
  }, []);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleEditClick = (employee) => {
    console.log(employee)
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/contractor/employee/${employeeToDelete.RFID}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
        withCredentials: true,
      });
      setEmployees(employees.filter((emp) => emp.employee_id !== employeeToDelete.employee_id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div className={classes.root}>
      {(
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}>Photo</TableCell>
                <TableCell className={classes.headerCell}>Location</TableCell>
                <TableCell className={classes.headerCell}>RFID</TableCell>
                <TableCell className={classes.headerCell}>Status</TableCell>
                <TableCell className={classes.headerCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={employee.RFID}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <TableCell>
                    <Avatar className={classes.avatar}>
                      {<Avatar/>}
                    </Avatar>
                  </TableCell>
                  <TableCell>{employee.location}</TableCell>
                  <TableCell>{employee.RFID}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(employee)}>
                      <Edit />
                    </IconButton>
                    {/* <IconButton onClick={() => handleDeleteClick(employee)}>
                      <Delete />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Inspect Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Location: {selectedEmployee?.location}
          </DialogContentText>
          <DialogContentText>
            RFID: {selectedEmployee?.RFID}
          </DialogContentText>
          <DialogContentText>
            Status: {selectedEmployee?.status}
          </DialogContentText>
          <DialogContentText>
            Method: {selectedEmployee?.method}
          </DialogContentText>
          <DialogContentText>
            Request Check: {selectedEmployee?.requestCheck ? "Yes" : "No"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Request Access
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Tracker;
