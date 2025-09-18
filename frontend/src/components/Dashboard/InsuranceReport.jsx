import React from "react";
import { Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const insuranceData = [
  {
    policyNumber: "IN123456",
    policyName: "Life Secure Plan",
    policyType: "Life",
    premium: "10,000/-",
    coverageAmount: "5,00,000/-",
    startDate: "01-Jan-2022",
    maturityDate: "01-Jan-2042",
    status: "Active",
  },
  {
    policyNumber: "IN654321",
    policyName: "Health Plus",
    policyType: "Health",
    premium: "7,500/-",
    coverageAmount: "3,00,000/-",
    startDate: "15-Feb-2023",
    maturityDate: "15-Feb-2033",
    status: "Active",
  },
  {
    policyNumber: "IN789012",
    policyName: "Child Education",
    policyType: "Child",
    premium: "8,000/-",
    coverageAmount: "4,00,000/-",
    startDate: "10-Mar-2021",
    maturityDate: "10-Mar-2036",
    status: "Active",
  },
];

const InsuranceReport = () => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Insurance Report", 14, 18);
    doc.setFontSize(12);
    doc.text("All Bought Insurance Policies", 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [[
        "Policy Number", "Policy Name", "Policy Type", "Premium", "Coverage Amount", "Start Date", "Maturity Date", "Status"
      ]],
      body: insuranceData.map(row => [
        row.policyNumber,
        row.policyName,
        row.policyType,
        row.premium,
        row.coverageAmount,
        row.startDate,
        row.maturityDate,
        row.status,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save("InsuranceReport.pdf");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Insurance Report
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        List of all bought insurance policies.
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Policy Number</TableCell>
              <TableCell>Policy Name</TableCell>
              <TableCell>Policy Type</TableCell>
              <TableCell>Premium</TableCell>
              <TableCell>Coverage Amount</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Maturity Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {insuranceData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.policyNumber}</TableCell>
                <TableCell>{row.policyName}</TableCell>
                <TableCell>{row.policyType}</TableCell>
                <TableCell>{row.premium}</TableCell>
                <TableCell>{row.coverageAmount}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.maturityDate}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button variant="contained" color="success" onClick={handleDownloadPDF} sx={{ mb: 3 }}>
        Download PDF
      </Button>
    </Box>
  );
};

export default InsuranceReport;