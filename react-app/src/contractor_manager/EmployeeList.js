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
} from "@material-ui/core";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/contractor/employee", {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          withCredentials: true,
        });
        console.log('API response:', response.data);
        setEmployees(response.data.employees);
        console.log('employees: ', employees)
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    console.log('Employees state updated:', employees);
  }, [employees]);

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom className={classes.title}>
        Employee List
      </Typography>
      {loading ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}>Profile</TableCell>
                <TableCell className={classes.headerCell}>
                  Employee ID
                </TableCell>
                <TableCell className={classes.headerCell}>Full Name</TableCell>
                <TableCell className={classes.headerCell}>Job Title</TableCell>
                <TableCell className={classes.headerCell}>
                  Payment Rate/Hour
                </TableCell>
                <TableCell className={classes.headerCell}>
                  Assigned Route
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>
                    <Link
                      to={`/employee/${employee.employee_id}`}
                      className={classes.link}
                    >
                      <Avatar className={classes.avatar}>
                        {employee.full_name.charAt(0)}
                      </Avatar>
                    </Link>
                  </TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.payment_rate_per_hour}</TableCell>
                  <TableCell>{employee.assigned_collection_route}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default EmployeeList;
