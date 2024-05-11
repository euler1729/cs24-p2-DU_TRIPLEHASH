import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import jsPDF from "jspdf";
import logo from "../EcoSyncBrand/logogif.gif";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
  },
}));



const contractors = [
  {
    id: 1,
    company_name: "ABC Ltd",
    contractor_id: "C001",
    manager_name: "Mahmudul Hasan",
    area: "Banasree",
  },
  {
    id: 2,
    company_name: "XYZ Ltd",
    contractor_id: "C002",
    manager_name: "Nafiul Hasan",
    area: "Gabtoli",
  },
  // Add more contractors as needed
];

const ContractorBilling = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [date, setDate] = useState("");

  const handleClickOpen = (contractor) => {
    setSelectedContractor(contractor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDate("");
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleGenerateBill = () => {
    const { company_name, contractor_id, manager_name, area } =
      selectedContractor;

    

    // Sample values for calculation
    const Wc = 10; // Weight of waste collected by the contractor in tons
    const Wr = 15; // Required waste the contractor must collect in tons
    const Pt = 500; // Payment per tonnage of waste in taka
    const F = 100; // Fine rate for each ton of waste not collected as required

    // Calculations
    const basicPay = Wc * Pt;
    const deficit = Math.max(0, Wr - Wc);
    const fine = deficit * F;
    const totalBill = basicPay - fine;

    // Create a PDF document
    const doc = new jsPDF();

    // Add the logo
    doc.addImage(logo, "PNG", 10, 10, 50, 20); // Adjust the size and position as needed

    // Add styles and content
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Contractor Billing", 70, 20);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Company Name: ${company_name}`, 10, 40);
    doc.text(`Contractor ID: ${contractor_id}`, 10, 50);
    doc.text(`Manager Name: ${manager_name}`, 10, 60);
    doc.text(`Area: ${area}`, 10, 70);
    doc.text(`Date: ${new Date(date).toLocaleDateString()}`, 10, 80);

    // Add a border
    doc.setLineWidth(0.5);
    doc.line(10, 30, 200, 30); // Horizontal line

    // Add background color to a section
    doc.setFillColor(230, 230, 230);
    doc.rect(10, 90, 190, 20, "F"); // Draw rectangle with background color

    // Add text over the colored section
    doc.setTextColor(0);
    doc.text("Billing Details", 15, 100);

    // Add billing details
    const textLeft = 10;
    const textRight = 180;
    doc.text(`Basic Pay:`, textLeft, 120);
    doc.text(`${basicPay.toFixed(2)} Taka`, textRight, 120, { align: "right" });
    doc.text(`Deficit:`, textLeft, 130);
    doc.text(`${deficit.toFixed(2)} tons`, textRight, 130, { align: "right" });
    doc.text(`Fine:`, textLeft, 140);
    doc.text(`${fine.toFixed(2)} Taka`, textRight, 140, { align: "right" });
    doc.text(`Total Bill:`, textLeft, 150);
    doc.text(`${totalBill.toFixed(2)} Taka`, textRight, 150, {
      align: "right",
    });

    // Add more sections as needed
    doc.text("Signature:", 10, 170);
    doc.text("____________________________", 10, 180);

    // Save the PDF
    doc.save(`${company_name}_bill.pdf`);

    handleClose();
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Contractor Billing
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Contractor ID</TableCell>
              <TableCell>Manager Name</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell>{contractor.company_name}</TableCell>
                <TableCell>{contractor.contractor_id}</TableCell>
                <TableCell>{contractor.manager_name}</TableCell>
                <TableCell>{contractor.area}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleClickOpen(contractor)}
                  >
                    Generate Bill
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Generate Bill</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To generate a bill, please select the date for the collection
            period.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="date"
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleGenerateBill} color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContractorBilling;
