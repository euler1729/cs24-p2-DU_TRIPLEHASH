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
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
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

const EmployeeList = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [props, setProps] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/contractor/employee", {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          withCredentials: true,
        });
        setEmployees(response.data.employees);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/contractor/employee/${employeeToDelete.employee_id}`, {
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
      {selectedEmployee ? (
        <EmployeeProfile employee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}>Profile</TableCell>
                <TableCell className={classes.headerCell}>Employee ID</TableCell>
                <TableCell className={classes.headerCell}>Full Name</TableCell>
                <TableCell className={classes.headerCell}>Job Title</TableCell>
                <TableCell className={classes.headerCell}>Payment Rate/Hour</TableCell>
                <TableCell className={classes.headerCell}>Assigned Route</TableCell>
                <TableCell className={classes.headerCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={employee.employee_id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <TableCell>
                    <Avatar className={classes.avatar}>
                      {employee.full_name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.payment_rate_per_hour}</TableCell>
                  <TableCell>{employee.assigned_collection_route}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(employee)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(employee)}>
                      <Delete />
                    </IconButton>
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
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {employeeToDelete?.full_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeList;
