import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    TextField,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import AppTheme from "../../shared-theme/AppTheme";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { loadStripe } from "@stripe/stripe-js";

export default function FundDetailsDialog({ open, onClose, rowData }) {
    if (!rowData) return null;

    const [dates, setDates] = useState([]);
    const [navs, setNavs] = useState([]);
    const [showSIPModal, setShowSIPModal] = useState(false);
    const [amount, setAmount] = useState();
    const [date, setDate] = useState(dayjs());
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const res = await fetch(
                `https://api.mfapi.in/mf/${rowData?.schemeCode}`
            );
            const json = await res.json();

            const navData = json.data.slice(0, 70).map((d) => ({
                date: d.date,
                nav: parseFloat(d.nav),
            }));

            setDates(navData.reverse().map((d) => d.date));
            setNavs(navData.reverse().map((d) => d.nav));
            setLoading(false);
        }
        fetchData();
    }, [rowData.schemeCode]);

    function handleStartSIP() {
        setShowSIPModal(true);
    }

    function handleCloseSIP() {
        setShowSIPModal(false);
        setAmount("");
    }

    async function handlePurchase() {
        function addMonths(date, months) {
            let d = new Date(date);
            let day = d.getDate();

            d.setMonth(d.getMonth() + months);

            if (d.getDate() < day) {
                d.setDate(0);
            }
            return d;
        }

        const startDate = new Date(date);
        const nextPaymentDate = addMonths(startDate, 0);
        nextPaymentDate.setDate(startDate.getDate() + 5);
        navigate("/payment", {
            state: {
                schemeCode: rowData.schemeCode,
                schemeName: rowData.schemeName,
                amount: Number.parseInt(amount),
                nav: navs[navs.length - 1],
                startDate: startDate,
                nextPaymentDate: nextPaymentDate,
                units: amount / navs[navs.length - 1],
            },
        });
    }
    // async function handlePurchase() {
    //   const stripe = await loadStripe(
    //     import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    //   );
    //   function addMonths(date, months) {
    //     let d = new Date(date);
    //     let day = d.getDate();

    //     d.setMonth(d.getMonth() + months);

    //     if (d.getDate() < day) {
    //       d.setDate(0);
    //     }
    //     return d;
    //   }

    //   const startDate = new Date(date);
    //   const nextPaymentDate = addMonths(startDate, 0);
    //   nextPaymentDate.setDate(startDate.getDate() + 5);
    //   const data = {
    //     schemeCode: rowData.schemeCode,
    //     schemeName: rowData.schemeName,
    //     frequency: "MONTHLY",
    //     startDate: startDate,
    //     nextDate: nextPaymentDate,
    //     amount: Number.parseInt(amount),
    //     nav: navs[navs.length - 1],
    //     units: amount / navs[navs.length - 1],
    //   };
    //   const res = await fetch("http://localhost:4000/api/investments/mf-buy", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //     body: JSON.stringify(data),
    //   });

    //   const session = await res.json();

    //   if (res.status === 201) {

    //   }

    //   const result = await stripe.redirectToCheckout({
    //     sessionId: session.id,
    //   });

    //   handleCloseSIP();
    // }

    return (
        <AppTheme sx={{ width: "100%" }}>
            <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
                <DialogTitle>{rowData.schemeName}</DialogTitle>
                <div style={{ display: "flex" }}>
                    <div>
                        <Box
                            sx={{
                                width: "100%",
                                height: 600,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {loading ? (
                                <CircularProgress size="6rem" />
                            ) : (
                                <LineChart
                                    xAxis={[
                                        {
                                            scaleType: "point",
                                            data: dates,
                                            tickLabelStyle: { display: "none" },
                                        },
                                    ]}
                                    series={[
                                        {
                                            data: navs,
                                            label: "NAV",
                                            color: "#00ccff",
                                            showMark: true,
                                        },
                                    ]}
                                    width={1200}
                                    height={600}
                                />
                            )}
                        </Box>
                    </div>
                    <DialogContent dividers>
                        <Stack spacing={2}>
                            <Typography>
                                <b>Scheme Name:</b> {rowData.schemeName}
                            </Typography>
                            <Typography>
                                <b>Scheme Code:</b> {rowData.schemeCode}
                            </Typography>
                            <Typography>
                                <b>ISIN Growth:</b> {rowData.isinGrowth}
                            </Typography>
                            <Typography>
                                <b>ISIN Reinvestment:</b> {rowData.isinReinv}
                            </Typography>
                            <Typography>
                                <b>NAV:</b> {navs[navs.length - 1]}
                            </Typography>
                            <Typography>
                                <b>Date:</b> {rowData.dateText}
                            </Typography>
                        </Stack>
                    </DialogContent>
                </div>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartSIP}
                    >
                        Start SIP
                    </Button>
                </DialogActions>
            </Dialog>
            {/* SIP Modal with Keypad */}
            <Dialog
                open={showSIPModal}
                onClose={handleCloseSIP}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Enter SIP Amount</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        placeholder="Enter SIP Amount (₹)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{ width: "100%" }}
                            label="Monthly"
                            onChange={(newValue) => setDate(newValue)}
                            value={date}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSIP}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handlePurchase()}
                        disabled={!amount}
                    >
                        Pay
                    </Button>
                </DialogActions>
            </Dialog>{" "}
            {/* <-- Add this line to close the SIP Modal Dialog */}
        </AppTheme>
    );
}
