// import * as React from "react";
// import { useState, useMemo } from "react";
// import {
//   Typography,
//   Slider,
//   CardContent,
//   CssBaseline,
//   Stack,
//   Box,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";
// import MuiCard from "@mui/material/Card";
// import AppTheme from "../../shared-theme/AppTheme";

// const Card = styled(MuiCard)(({ theme }) => ({
//   borderRadius: 20,
//   background: theme.palette.background.default,
//   color: theme.palette.text.primary,
//   boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
// }));

// export default function RentVsBuyCalculator() {
//   const [monthlyRent, setMonthlyRent] = useState(20000);
//   const [annualRentInc, setAnnualRentInc] = useState(5);
//   const [housePrice, setHousePrice] = useState(5000000);
//   const [downPaymentPct, setDownPaymentPct] = useState(20);
//   const [loanTenure, setLoanTenure] = useState(20);
//   const [loanRate, setLoanRate] = useState(8);
//   const [appreciation, setAppreciation] = useState(5);
//   const [years, setYears] = useState(10);
//   const [investmentReturn, setInvestmentReturn] = useState(12);

//   // EMI Formula
//   const calculateEMI = (P, r, n) => {
//     const monthlyRate = r / 12 / 100;
//     return (
//       P *
//       monthlyRate *
//       Math.pow(1 + monthlyRate, n) /
//       (Math.pow(1 + monthlyRate, n) - 1)
//     );
//   };

//   const result = useMemo(() => {
//     // Renting
//     let rent = 0;
//     let currentRent = monthlyRent;
//     for (let y = 1; y <= years; y++) {
//       rent += currentRent * 12;
//       currentRent *= 1 + annualRentInc / 100;
//     }

//     // Assume renter invests the down payment
//     const downPayment = (downPaymentPct / 100) * housePrice;
//     const investedValue = downPayment * Math.pow(1 + investmentReturn / 100, years);

//     // Buying
//     const loanAmount = housePrice - downPayment;
//     const emi = calculateEMI(loanAmount, loanRate, loanTenure * 12);
//     let totalEmiPaid = 0;
//     if (years <= loanTenure) {
//       totalEmiPaid = emi * years * 12;
//     } else {
//       totalEmiPaid = emi * loanTenure * 12; // full repayment
//     }

//     const propertyValue = housePrice * Math.pow(1 + appreciation / 100, years);
//     const totalBuyCost = downPayment + totalEmiPaid;
//     const netBuyValue = propertyValue - totalBuyCost;

//     // Compare
//     const rentAdvantage = investedValue - rent;

//     return {
//       rentPaid: Math.round(rent),
//       investedValue: Math.round(investedValue),
//       totalBuyCost: Math.round(totalBuyCost),
//       propertyValue: Math.round(propertyValue),
//       netBuyValue: Math.round(netBuyValue),
//       better: netBuyValue > rentAdvantage ? "Buying" : "Renting",
//     };
//   }, [
//     monthlyRent,
//     annualRentInc,
//     housePrice,
//     downPaymentPct,
//     loanTenure,
//     loanRate,
//     appreciation,
//     years,
//     investmentReturn,
//   ]);

//   const data = [
//     {
//       name: "Renting",
//       Value: result.investedValue - result.rentPaid,
//     },
//     {
//       name: "Buying",
//       Value: result.netBuyValue,
//     },
//   ];

//   return (
//     <AppTheme>
//       <CssBaseline enableColorScheme />
//       <Card sx={{ p: 3, width: "50%", height: "85%" }}>
//         <CardContent>
//           <Stack spacing={3}>
//             <Typography variant="h6" fontWeight="bold" color="primary.main">
//               🏠 Rent vs Buy Calculator
//             </Typography>

//             <Box>
//               <Typography variant="h5" fontWeight="bold" color="primary.main">
//                 Better Option: {result.better}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Rent Paid: ₹{result.rentPaid.toLocaleString()} | Investment Value: ₹
//                 {result.investedValue.toLocaleString()} | Net Buy Value: ₹
//                 {result.netBuyValue.toLocaleString()}
//               </Typography>
//             </Box>

//             {/* Chart */}
//             <Box sx={{ height: 300 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data}>
//                   <XAxis dataKey="name" stroke="#aaa" />
//                   <Tooltip
//                     formatter={(val) => `₹${val.toLocaleString()}`}
//                     contentStyle={{
//                       backgroundColor: "#222",
//                       borderRadius: "8px",
//                       border: "none",
//                       color: "#fff",
//                     }}
//                   />
//                   <Bar dataKey="Value" fill="#1565c0" radius={[12, 12, 0, 0]}>
//                     <LabelList
//                       dataKey="Value"
//                       position="top"
//                       formatter={(val) => `₹${val.toLocaleString()}`}
//                       style={{ fill: "#222", fontWeight: "bold" }}
//                     />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </Box>

//             {/* Inputs */}
//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Monthly Rent
//               </Typography>
//               <Slider
//                 value={monthlyRent}
//                 min={5000}
//                 max={100000}
//                 step={1000}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
//                 onChange={(e, val) => setMonthlyRent(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Annual Rent Increase %
//               </Typography>
//               <Slider
//                 value={annualRentInc}
//                 min={0}
//                 max={10}
//                 step={0.5}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `${val}%`}
//                 onChange={(e, val) => setAnnualRentInc(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 House Price
//               </Typography>
//               <Slider
//                 value={housePrice}
//                 min={1000000}
//                 max={20000000}
//                 step={100000}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
//                 onChange={(e, val) => setHousePrice(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Down Payment %
//               </Typography>
//               <Slider
//                 value={downPaymentPct}
//                 min={10}
//                 max={50}
//                 step={1}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `${val}%`}
//                 onChange={(e, val) => setDownPaymentPct(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Loan Tenure (Years)
//               </Typography>
//               <Slider
//                 value={loanTenure}
//                 min={5}
//                 max={30}
//                 step={1}
//                 valueLabelDisplay="on"
//                 onChange={(e, val) => setLoanTenure(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Loan Interest Rate % (p.a.)
//               </Typography>
//               <Slider
//                 value={loanRate}
//                 min={5}
//                 max={15}
//                 step={0.1}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `${val}%`}
//                 onChange={(e, val) => setLoanRate(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Property Appreciation % (p.a.)
//               </Typography>
//               <Slider
//                 value={appreciation}
//                 min={0}
//                 max={15}
//                 step={0.5}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `${val}%`}
//                 onChange={(e, val) => setAppreciation(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Investment Return % (for renter)
//               </Typography>
//               <Slider
//                 value={investmentReturn}
//                 min={5}
//                 max={20}
//                 step={0.5}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `${val}%`}
//                 onChange={(e, val) => setInvestmentReturn(val)}
//               />
//             </Box>

//             <Box>
//               <Typography gutterBottom color="primary.main">
//                 Comparison Period (Years)
//               </Typography>
//               <Slider
//                 value={years}
//                 min={5}
//                 max={30}
//                 step={1}
//                 valueLabelDisplay="on"
//                 valueLabelFormat={(val) => `${val}Y`}
//                 onChange={(e, val) => setYears(val)}
//               />
//             </Box>
//           </Stack>
//         </CardContent>
//       </Card>
//     </AppTheme>
//   );
// }