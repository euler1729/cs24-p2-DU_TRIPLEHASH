import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography, Grid, Paper, makeStyles, Avatar, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import api from '../API';
import Cookies from 'universal-cookie';
import EcoSyncBrand from '../EcoSyncBrand/EcoSyncBrand.json';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        backgroundColor: EcoSyncBrand.Colors.green,
        color: EcoSyncBrand.Colors.greenWhite,
    },
    title: {
        fontWeight: 'bold',
        color: EcoSyncBrand.Colors.greenTeaDark,
    },
    info: {
        marginBottom: theme.spacing(2),
    },
    tableContainer: {
        marginTop: theme.spacing(3),
    },
    headerCell: {
        fontWeight: 'bold',
        backgroundColor: EcoSyncBrand.Colors.greenTeaDark,
        color: EcoSyncBrand.Colors.greenWhite,
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    calendar: {
        marginTop: theme.spacing(3),
    },
}));

const EmployeeProfile = () => {
    const { id } = useParams();
    const classes = useStyles();
    const cookies = new Cookies();
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`/employees/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${cookies.get('access_token')}`,
                    },
                    withCredentials: true
                });
                setEmployee(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch employee:', error);
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id, cookies]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get(`/employees/${id}/logs`, {
                    headers: {
                        "Authorization": `Bearer ${cookies.get('access_token')}`,
                    },
                    withCredentials: true,
                    params: {
                        date: selectedDate.toISOString()
                    }
                });
                setLogs(response.data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            }
        };
        if (employee) {
            fetchLogs();
        }
    }, [id, selectedDate, employee, cookies]);

    return (
        <div className={classes.root}>
            {loading ? (
                <div className={classes.loader}>
                    <CircularProgress />
                </div>
            ) : (
                employee && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Avatar className={classes.avatar}>
                                {employee.full_name.charAt(0)}
                            </Avatar>
                            <Typography variant="h5" className={classes.title}>
                                {employee.full_name}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Employee ID:</strong> {employee.employee_id}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Date of Birth:</strong> {employee.date_of_birth}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Date of Hire:</strong> {employee.date_of_hire}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Job Title:</strong> {employee.job_title}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Payment Rate/Hour:</strong> {employee.payment_rate_per_hour}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Contact Information:</strong> {employee.contact_information}
                            </Typography>
                            <Typography variant="body1" className={classes.info}>
                                <strong>Assigned Collection Route:</strong> {employee.assigned_collection_route}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DatePicker
                                    autoOk
                                    variant="static"
                                    openTo="date"
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    className={classes.calendar}
                                />
                            </MuiPickersUtilsProvider>
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.headerCell}>Date</TableCell>
                                            <TableCell className={classes.headerCell}>Log-in Time</TableCell>
                                            <TableCell className={classes.headerCell}>Log-out Time</TableCell>
                                            <TableCell className={classes.headerCell}>Total Hours Worked</TableCell>
                                            <TableCell className={classes.headerCell}>Overtime Hours</TableCell>
                                            <TableCell className={classes.headerCell}>Absences and Leaves</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <TableRow key={log.date}>
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
                        </Grid>
                    </Grid>
                )
            )}
        </div>
    );
};

export default EmployeeProfile;
