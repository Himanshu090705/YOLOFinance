import React from "react";
import { Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const swpData = [
  {
    schemeName: "ICICI Prudential SWP Fund - REGULAR - GROWTH",
    schemeCode: "120001",
    isinGrowth: "INF109K01Z23",
    nav: "98.1234",
    date: "09-Sep-2025",
    units: 80,
    amount: 7850.00,
  },
  {
    schemeName: "Axis SWP Advantage Fund - DIRECT - IDCW",
    schemeCode: "130002",
    isinGrowth: "INF846K01X45",
    nav: "112.4567",
    date: "09-Sep-2025",
    units: 60,
    amount: 6747.40, 
  },
  {
    schemeName: "Kotak SWP Bluechip Fund - REGULAR - IDCW",
    schemeCode: "140003",
    isinGrowth: "INF174K01Y67",
    nav: "76.5432",
    date: "09-Sep-2025",
    units: 120,
    amount: 9185.18,
  },
];

const SWPReport = () => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SWP Report", 14, 18);
    doc.setFontSize(12);
    doc.text("All Bought SWPs", 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [[
        "Scheme Name", "Scheme Code", "ISIN Growth", "NAV", "Date", "Units", "Amount (₹)"
      ]],
      body: swpData.map(row => [
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

    doc.save("SWPReport.pdf");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        SWP Report
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        List of all bought SWPs.
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
            {swpData.map((row, idx) => (
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
      <Button variant="contained" color="info" onClick={handleDownloadPDF} sx={{ mb: 3 }}>
        Download PDF
      </Button>
    </Box>
  );
};

export default SWPReport;