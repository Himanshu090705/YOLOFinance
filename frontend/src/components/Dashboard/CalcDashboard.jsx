import * as React from "react";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AppNavbar from "./components/AppNavbar.jsx";
import Header from "./components/Header.jsx";
import SideMenu from "./components/SideMenu.jsx";
import AppTheme from "../shared-theme/AppTheme.jsx";

// Calculators
import SipCalculator from "./Calculators/SipCalculator.jsx";
import CapitalGainsCalculator from "./Calculators/CapitalGainsCalculator.jsx";
import EmiCalculator from "./Calculators/EmiCalculator.jsx";
import LumpsumCalculator from "./Calculators/LumpsumCalculator.jsx";
import SwpCalculator from "./Calculators/SWPCalculator.jsx";
import LoanEligibilityCalculator from "./Calculators/LoanEligibilityCalculator.jsx";
import DebtPayoffCalculator from "./Calculators/DebtPayoffCalculator.jsx";
import IncomeTaxCalculator from "./Calculators/IncomeTaxCalculator.jsx";
import CurrencyConverter from "./Calculators/CurrencyConverter.jsx";
import PrepaymentCalculator from "./Calculators/PrepaymentCalculator.jsx";
// import RentVsBuyCalculator from "./Calculators/RentVsBuyCalculator.jsx";
import LifeInsuranceCalculator from "./Calculators/LifeInsuranceCalculator.jsx";
import RetirementCorpusCalculator from "./Calculators/RetirementCorpusCalculator.jsx";
import GoalPlannerCalculator from "./Calculators/GoalPlannerCalculator.jsx";

// Shared
import BackButton from "../Home/components/BackButton.jsx";

import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "./theme/customizations/index.js";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function CalcDashboard() {
    const [selectedCalc, setSelectedCalc] = useState("none");

    const CalculatorWrapper = ({ children }) => (
        <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
            <BackButton onBack={() => setSelectedCalc("none")} />
            {children}
        </Stack>
    );

    const renderCalculator = () => {
        switch (selectedCalc) {
            case "sip":
                return (
                    <CalculatorWrapper>
                        <SipCalculator />
                    </CalculatorWrapper>
                );
            case "lumpsum":
                return (
                    <CalculatorWrapper>
                        <LumpsumCalculator />
                    </CalculatorWrapper>
                );
            case "emi":
                return (
                    <CalculatorWrapper>
                        <EmiCalculator />
                    </CalculatorWrapper>
                );
            case "capitalGains":
                return (
                    <CalculatorWrapper>
                        <CapitalGainsCalculator />
                    </CalculatorWrapper>
                );
            case "lifeInsurance":
                return (
                    <CalculatorWrapper>
                        <LifeInsuranceCalculator />
                    </CalculatorWrapper>
                );
            case "debtPayoff":
                return (
                    <CalculatorWrapper>
                        <DebtPayoffCalculator />
                    </CalculatorWrapper>
                );
            // case "rentVsBuy":
            //     return (
            //         <CalculatorWrapper>
            //             <RentVsBuyCalculator />
            //         </CalculatorWrapper>
            //     );
            case "prepayment":
                return (
                    <CalculatorWrapper>
                        <PrepaymentCalculator />
                    </CalculatorWrapper>
                );
            case "goalPlanner":
                return (
                    <CalculatorWrapper>
                        <GoalPlannerCalculator />
                    </CalculatorWrapper>
                );
            case "tax":
                return (
                    <CalculatorWrapper>
                        <IncomeTaxCalculator />
                    </CalculatorWrapper>
                );
            case "currency":
                return (
                    <CalculatorWrapper>
                        <CurrencyConverter />
                    </CalculatorWrapper>
                );
            case "retirementCorpus":
                return (
                    <CalculatorWrapper>
                        <RetirementCorpusCalculator />
                        {/* or <RetirementCorpusCalculatorDetailed /> */}
                    </CalculatorWrapper>
                );
            case "swp":
                return (
                    <CalculatorWrapper>
                        <SwpCalculator />
                    </CalculatorWrapper>
                );

            default:
                return (
                    <Box sx={{ flexGrow: 1, mt: 4, px: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Choose a Calculator
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr", // 1 column on mobile
                                    sm: "1fr 1fr", // 2 columns on small screens
                                    md: "1fr 1fr 1fr", // 3 columns on medium+
                                },
                                gap: 3,
                                justifyItems: "center",
                            }}
                        >
                            {[
                                {
                                    key: "sip",
                                    label: "📈 SIP Calculator",
                                    color: "primary",
                                },
                                {
                                    key: "swp",
                                    label: "💸 SWP Calculator",
                                    color: "info",
                                },
                                {
                                    key: "lumpsum",
                                    label: "💰 Lumpsum Calculator",
                                    color: "secondary",
                                },
                                {
                                    key: "emi",
                                    label: "🏦 EMI Calculator",
                                    color: "success",
                                },
                                // {
                                //     key: "rentVsBuy",
                                //     label: "🏠 Rent vs Buy",
                                //     color: "secondary",
                                // },
                                {
                                    key: "goalPlanner",
                                    label: "🎯 Goal Planner",
                                    color: "info",
                                },
                                {
                                    key: "currency",
                                    label: "💱 Currency Converter",
                                    color: "info",
                                },
                                {
                                    key: "retirementCorpus",
                                    label: "🧓 Retirement Corpus",
                                    color: "info",
                                },

                                {
                                    key: "prepayment",
                                    label: "💰 Loan Prepayment",
                                    color: "success",
                                },

                                {
                                    key: "debtPayoff",
                                    label: "💳 Debt Payoff Calculator",
                                    color: "error",
                                },
                                {
                                    key: "capitalGains",
                                    label: "💵 Capital Gains Tax",
                                    color: "warning",
                                },
                                {
                                    key: "lifeInsurance",
                                    label: "🏦 Life Insurance Calculator",
                                    color: "warning",
                                },
                                {
                                    key: "tax",
                                    label: "🧾 Income Tax Calculator",
                                    color: "warning",
                                },
                            ]
//                             [
//   {
//     key: "sip",
//     label: (
//       <>
//         <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }}></i>
//         SIP Calculator
//       </>
//     ),
//     color: "primary",
//   },
//   {
//     key: "swp",
//     label: (
//       <>
//         <i className="fa-solid fa-hand-holding-dollar" style={{ marginRight: 8 }}></i>
//         SWP Calculator
//       </>
//     ),
//     color: "info",
//   },
//   {
//     key: "lumpsum",
//     label: (
//       <>
//         <i className="fa-solid fa-sack-dollar" style={{ marginRight: 8 }}></i>
//         Lumpsum Calculator
//       </>
//     ),
//     color: "secondary",
//   },
//   {
//     key: "emi",
//     label: (
//       <>
//         <i className="fa-solid fa-building-columns" style={{ marginRight: 8 }}></i>
//         EMI Calculator
//       </>
//     ),
//     color: "success",
//   },
//   {
//     key: "goalPlanner",
//     label: (
//       <>
//         <i className="fa-solid fa-bullseye" style={{ marginRight: 8 }}></i>
//         Goal Planner
//       </>
//     ),
//     color: "info",
//   },
//   {
//     key: "currency",
//     label: (
//       <>
//         <i className="fa-solid fa-coins" style={{ marginRight: 8 }}></i>
//         Currency Converter
//       </>
//     ),
//     color: "info",
//   },
//   {
//     key: "retirementCorpus",
//     label: (
//       <>
//         <i className="fa-solid fa-person-cane" style={{ marginRight: 8 }}></i>
//         Retirement Corpus
//       </>
//     ),
//     color: "info",
//   },
//   {
//     key: "prepayment",
//     label: (
//       <>
//         <i className="fa-solid fa-money-bill-trend-up" style={{ marginRight: 8 }}></i>
//         Loan Prepayment
//       </>
//     ),
//     color: "success",
//   },
//   {
//     key: "debtPayoff",
//     label: (
//       <>
//         <i className="fa-solid fa-credit-card" style={{ marginRight: 8 }}></i>
//         Debt Payoff Calculator
//       </>
//     ),
//     color: "error",
//   },
//   {
//     key: "capitalGains",
//     label: (
//       <>
//         <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: 8 }}></i>
//         Capital Gains Tax
//       </>
//     ),
//     color: "warning",
//   },
//   {
//     key: "lifeInsurance",
//     label: (
//       <>
//         <i className="fa-solid fa-shield-heart" style={{ marginRight: 8 }}></i>
//         Life Insurance Calculator
//       </>
//     ),
//     color: "warning",
//   },
//   {
//     key: "tax",
//     label: (
//       <>
//         <i className="fa-solid fa-receipt" style={{ marginRight: 8 }}></i>
//         Income Tax Calculator
//       </>
//     ),
//     color: "warning",
//   },
// ]
.map((item) => (
                                <Paper
                                    key={item.key}
                                    onClick={() => setSelectedCalc(item.key)}
                                    elevation={4}
                                    sx={{
                                        width: "100%",
                                        height: 120,
                                        p: 3,
                                        borderRadius: 4,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        backgroundColor: (theme) =>
                                            theme.palette[item.color].main +
                                            "22",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            backgroundColor: (theme) =>
                                                theme.palette[item.color].main +
                                                "44",
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        align="center"
                                        color={`${item.color}.main`}
                                    >
                                        {item.label}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                );
        }
    };

    return (
        <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: "flex" }}>
                <SideMenu />
                <AppNavbar />
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflowY: "auto", // ✅ only vertical scroll
                        overflowX: "hidden", // ✅ no horizontal scroll
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: "center",
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                            width: "100%",
                        }}
                    >
                        <Header name="Finance Calculators" />
                        {renderCalculator()}
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
