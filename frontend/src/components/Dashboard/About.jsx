import * as React from "react";
import {
    Box,
    Stack,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    Button,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import InsightsIcon from "@mui/icons-material/Insights";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SecurityIcon from "@mui/icons-material/Security";

const teamMembers = [
    {
        name: "Alice Johnson",
        role: "AI & Backend Developer",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
        linkedin: "#",
        github: "#",
    },
    {
        name: "Bob Smith",
        role: "Frontend Developer",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        linkedin: "#",
        github: "#",
    },
    {
        name: "Charlie Brown",
        role: "Finance Specialist",
        img: "https://randomuser.me/api/portraits/men/76.jpg",
        linkedin: "#",
        github: "#",
    },
    {
        name: "Diana Prince",
        role: "Product Designer",
        img: "https://randomuser.me/api/portraits/women/45.jpg",
        linkedin: "#",
        github: "#",
    },
];

export default function About() {
    return (
        <Box sx={{ p: 3 }}>
            {/* Hero */}
            <Box textAlign="center" sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    About Us
                </Typography>
                <Divider
                    sx={{
                        mb: 3,
                        width: 120,
                        mx: "auto",
                        borderColor: "primary.main",
                    }}
                />
                <Typography
                    variant="body1"
                    color="text.secondary"
                    maxWidth="md"
                    mx="auto"
                    sx={{ lineHeight: 1.8 }}
                >
                    We are a passionate team committed to transforming the way
                    people manage their wealth. Our platform brings together{" "}
                    <strong>
                        Mutual Funds, Insurance, Bonds, AI-powered Lakshmi
                        Assistant,
                    </strong>{" "}
                    and a <strong>daily finance news hub</strong> into one
                    seamless experience.
                    <br />
                    <br />
                    Finance can feel overwhelming — scattered apps, complex
                    jargon, and hidden charges. That’s why we built a{" "}
                    <em>
                        transparent, intelligent, and user-friendly ecosystem
                    </em>{" "}
                    that puts users in control.
                    <br />
                    <br />
                    Whether you’re a first-time investor or a seasoned pro, our
                    goal is to provide the clarity, tools, and insights you need
                    to grow your wealth with confidence.
                </Typography>
            </Box>

            {/* Journey */}
            {/* Our Journey Section */}
            <Box textAlign="center" sx={{ mb: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Our Journey
                </Typography>
                <Divider
                    sx={{
                        mb: 3,
                        width: 100,
                        mx: "auto",
                        borderColor: "primary.main",
                    }}
                />

                <Typography
                    variant="body1"
                    color="text.secondary"
                    maxWidth="md"
                    mx="auto"
                    sx={{ mb: 3, lineHeight: 1.9 }}
                >
                    Our story began with a simple observation — managing
                    investments was far too complex for everyday people. Too
                    many platforms, too much jargon, and too little
                    transparency. We knew finance could be simplified, so we set
                    out to build a platform that makes wealth management both
                    intuitive and powerful.
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    maxWidth="md"
                    mx="auto"
                    sx={{ mb: 3, lineHeight: 1.9 }}
                >
                    What started as a small idea between four like-minded
                    individuals quickly grew into a mission. We combined
                    cutting-edge technology with financial expertise to create a
                    platform where users can track mutual funds, insurance,
                    bonds, and much more — all in one place.
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    maxWidth="md"
                    mx="auto"
                    sx={{ lineHeight: 1.9 }}
                >
                    Today, our journey continues with a focus on innovation and
                    trust. We are constantly evolving, adding new tools, and
                    expanding features to help our users achieve their financial
                    goals. This is not just our story — it’s a journey we share
                    with every person who chooses to grow with us.
                </Typography>
            </Box>

            {/* Team */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    Meet Our Team
                </Typography>
                <Divider
                    sx={{
                        mb: 3,
                        width: 100,
                        mx: "auto",
                        borderColor: "primary.main",
                    }}
                />

                <Grid container spacing={3} justifyContent="center">
                    {teamMembers.map((m, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card
                                sx={{
                                    Width: 300,
                                    height:300,
                                    borderRadius: 3,
                                    textAlign: "center",
                                    p: 2,
                                    "&:hover": {
                                        boxShadow: 4,
                                        transform: "translateY(-4px)",
                                    },
                                    transition: "0.3s",
                                }}
                            >
                                <Avatar
                                    src={m.img}
                                    alt={m.name}
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                />
                                <CardContent>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                    >
                                        {m.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        mb={1}
                                    >
                                        {m.role}
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        justifyContent="center"
                                    >
                                        <a
                                            href={m.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <LinkedInIcon color="primary" />
                                        </a>
                                        <a
                                            href={m.github}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <GitHubIcon color="action" />
                                        </a>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Values */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    Our Core Values
                </Typography>
                <Divider
                    sx={{
                        mb: 3,
                        width: 120,
                        mx: "auto",
                        borderColor: "primary.main",
                    }}
                />
                <Grid container spacing={4} justifyContent="center">
                    {[
                        {
                            icon: (
                                <SecurityIcon
                                    sx={{ fontSize: 40, color: "primary.main" }}
                                />
                            ),
                            title: "Trust",
                            text: "Security and transparency first.",
                        },
                        {
                            icon: (
                                <InsightsIcon
                                    sx={{ fontSize: 40, color: "primary.main" }}
                                />
                            ),
                            title: "Innovation",
                            text: "AI-driven insights made simple.",
                        },
                        {
                            icon: (
                                <ShowChartIcon
                                    sx={{ fontSize: 40, color: "primary.main" }}
                                />
                            ),
                            title: "Growth",
                            text: "We help users grow wealth with clarity.",
                        },
                        {
                            icon: (
                                <NewspaperIcon
                                    sx={{ fontSize: 40, color: "primary.main" }}
                                />
                            ),
                            title: "Knowledge",
                            text: "Daily finance updates empower decisions.",
                        },
                    ].map((v, i) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            textAlign="center"
                            key={i}
                        >
                            {v.icon}
                            <Typography variant="h6">{v.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {v.text}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Fun Facts */}
            <Box textAlign="center" sx={{ mb: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Fun Facts
                </Typography>
                <Divider
                    sx={{
                        mb: 3,
                        width: 100,
                        mx: "auto",
                        borderColor: "primary.main",
                    }}
                />
                <Grid container spacing={3} justifyContent="center">
                    {[
                        { number: "50+", label: "Mutual Funds Integrated" },
                        { number: "500+", label: "Daily News Articles" },
                        { number: "100%", label: "Secure Transactions" },
                    ].map((fact, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Typography
                                variant="h3"
                                color="primary.main"
                                fontWeight="bold"
                                gutterBottom
                            >
                                {fact.number}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {fact.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Mission */}
            <Box sx={{ mb: 6, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Our Mission
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    maxWidth="md"
                    mx="auto"
                >
                    To empower everyone with{" "}
                    <strong>AI-enhanced financial tools</strong> that make
                    investing, insurance, and wealth management{" "}
                    <strong>simple & accessible</strong>.
                </Typography>
            </Box>

            {/* CTA */}
            <Box textAlign="center">
                <Button
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: "30px", px: 4 }}
                >
                    Get in Touch
                </Button>
            </Box>
        </Box>
    );
}
