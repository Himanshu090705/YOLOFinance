import * as React from "react";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";
import SipCalculator from "../../Home/SipCalculator";
import NewsLetter from "../../Home/NewsLetter";
import MFGridTemp from "./MFGridTemp";

export default function MainGrid() {
    const [funds, setFunds] = useState([]);

    useEffect(() => {
        async function fetchFundData() {
            const schemeCodes = [
                { code: "102272", name: "Nifty Index Fund" },
                { code: "151724", name: "Nifty Midcap Mutual Fund" },
                // { code: "125496", name: "SBI Small Cap Fund" },
                { code: "100357", name: "ICICI Prudential Liquid Fund" },
                // { code: "130496", name: "HDFC Large and Mid Cap Fund" },
                { code: "112712", name: "Axis Liquid Fund" },
            ];

            try {
                const responses = await Promise.all(
                    schemeCodes.map((f) =>
                        fetch(`https://api.mfapi.in/mf/${f.code}`).then((res) =>
                            res.json()
                        )
                    )
                );

                const formattedFunds = responses.map((json, idx) => {
                    if (!json?.data) return null;

                    // Take last 30 NAVs
                    const navEntries = json.data.slice(0, 3650).reverse(); // oldest → latest
                    const navData = navEntries.map((d) => parseFloat(d.nav));
                    const navDates = navEntries.map((d) => d.date); // <-- Dates from API

                    return {
                        title: schemeCodes[idx].name,
                        value: `₹${navData[navData.length - 1].toFixed(2)}`, // latest NAV
                        interval: "Last 10 years",
                        trend:
                            navData[navData.length - 1] > navData[0]
                                ? "up"
                                : navData[navData.length - 1] < navData[0]
                                ? "down"
                                : "neutral",
                        data: navData,
                        labels: navDates, // <-- pass dates
                    };
                });

                setFunds(formattedFunds.filter(Boolean));
            } catch (err) {
                console.error("Error fetching NAV data:", err);
            }
        }

        fetchFundData();
    }, []);

    return (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                {funds.map((card, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard {...card} />
                    </Grid>
                ))}
                {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <HighlightedCard />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SessionsChart />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PageViewsBarChart />
                </Grid> */}
            </Grid>

            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Your Investments
            </Typography>
            <Grid container spacing={2} columns={9}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <MFGridTemp />
                </Grid>
                {/* <Grid size={{ xs: 12, lg: 5 }}>
                    <Stack
                        gap={2}
                        direction={{ xs: "column", sm: "row", lg: "column" }}
                    >
                        <SipCalculator />
                        <CustomizedTreeView />
                        <ChartUserByCountry />
                    </Stack>
                </Grid> */}
                <NewsLetter />
            </Grid>
            <Copyright sx={{ my: 4 }} />
        </Box>
    );
}
