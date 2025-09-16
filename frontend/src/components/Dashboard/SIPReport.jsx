import React from "react";
import { Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const sipData = [
  {
    schemeName: "Aditya Birla Sun Life Banking & PSU Debt Fund - DIRECT - IDC",
    schemeCode: "119551",
    isinGrowth: "INF209KA12Z1",
    nav: "108.3519",
    date: "09-Sep-2025",
    units: 100,
    amount: 10835.19,
  },
  {
    schemeName: "HDFC Equity Fund - DIRECT - GROWTH",
    schemeCode: "102345",
    isinGrowth: "INF179K01Z12",
    nav: "234.5678",
    date: "09-Sep-2025",
    units: 50,
    amount: 11728.39,
  },
  {
    schemeName: "SBI Bluechip Fund - REGULAR - IDCW",
    schemeCode: "110987",
    isinGrowth: "INF200K01V12",
    nav: "56.7890",
    date: "09-Sep-2025",
    units: 200,
    amount: 11357.80,
  },
];

const SIPReport = () => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SIP Report", 14, 18);
    doc.setFontSize(12);
    doc.text("All Bought SIPs", 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [[
        "Scheme Name", "Scheme Code", "ISIN Growth", "NAV", "Date", "Units", "Amount (₹)"
      ]],
      body: sipData.map(row => [
        row.schemeName,
        row.schemeCode,
        row.isinGrowth,
        row.nav,
        row.date,
        row.units,
        row.amount,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save("SIPReport.pdf");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        SIP Report
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        List of all bought SIPs.
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scheme Name</TableCell>
              <TableCell>Scheme Code</TableCell>
              <TableCell>ISIN Growth</TableCell>
              <TableCell>NAV</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sipData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.schemeName}</TableCell>
                <TableCell>{row.schemeCode}</TableCell>
                <TableCell>{row.isinGrowth}</TableCell>
                <TableCell>{row.nav}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.units}</TableCell>
                <TableCell>{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mb: 3 }}>
        Download PDF
      </Button>
    </Box>
  );
};

export default SIPReport;