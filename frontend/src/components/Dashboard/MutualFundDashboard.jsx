import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Chip,
    CssBaseline,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
    createTheme,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AppTheme from "../shared-theme/AppTheme";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "./theme/customizations";
import FundDetailsDialog from "./components/FundDetailsDialog";
import YoloFinanceLogo from "../../../assets/YoloFinance_transparent.png";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

const AMC_LOGOS = {
    SBI: "https://cdn.brandfetch.io/sbi.co.in/logo",
    ICICI: "https://cdn.brandfetch.io/icicibank.com/logo",
    HDFC: "https://cdn.brandfetch.io/hdfcbank.com/logo",
    Kotak: "https://cdn.brandfetch.io/kotak.com/logo",
    Axis: "https://cdn.brandfetch.io/axisbank.com/logo",
    Aditya: "https://cdn.brandfetch.io/adityabirlacapital.com/logo",
    UTI: "https://cdn.brandfetch.io/utimf.com/logo",
    Nippon: "https://cdn.brandfetch.io/nipponindiaim.com/logo",
    Franklin: "https://cdn.brandfetch.io/franklintempletonindia.com/logo",
    Edelweiss: "https://cdn.brandfetch.io/edelweissfin.com/logo",
    Canara: "https://cdn.brandfetch.io/canarabank.com/logo",
    Mirae: "https://cdn.brandfetch.io/miraeasset.co.in/logo",
    Motilal: "https://cdn.brandfetch.io/motilaloswalmf.com/logo",
    Tata: "https://cdn.brandfetch.io/tatacapital.com/logo",
    Invesco: "https://cdn.brandfetch.io/invescomutualfund.com/logo",
    Sundaram: "https://cdn.brandfetch.io/sundarammutual.com/logo",
    IDFC: "https://cdn.brandfetch.io/idfcfirstbank.com/logo",
    HSBC: "https://cdn.brandfetch.io/hsbc.co.in/logo",
    Baroda: "https://cdn.brandfetch.io/bobcaps.in/logo",
    LIC: "https://cdn.brandfetch.io/licindia.in/logo",
    Mahindra: "https://cdn.brandfetch.io/mahindrafinance.com/logo",
    PGIM: "https://cdn.brandfetch.io/pgim.com/logo",
    Quant: "https://cdn.brandfetch.io/quant.in/logo",
    Samco: "https://cdn.brandfetch.io/samco.in/logo",
    JM: "https://cdn.brandfetch.io/jmfinancial.com/logo",
    Union: "https://cdn.brandfetch.io/unionbankofindia.co.in/logo",
    IIFL: "https://cdn.brandfetch.io/iifl.com/logo",
    Parag: "https://cdn.brandfetch.io/ppfas.com/logo",
    Bajaj: "https://cdn.brandfetch.io/bajajfinserv.in/logo",
    Bandhan: "https://cdn.brandfetch.io/bandhanbank.com/logo",
    BarodaBNP: "https://cdn.brandfetch.io/barodabnpparibasmf.in/logo",
    DSP: "https://cdn.brandfetch.io/dspim.com/logo",
    Indiabulls: "https://cdn.brandfetch.io/indiabulls.com/logo",
    ITI: "https://cdn.brandfetch.io/itimutualfund.com/logo",
    Navi: "https://cdn.brandfetch.io/navimutualfund.com/logo",
    Shriram: "https://cdn.brandfetch.io/shrirammf.com/logo",
    Taurus: "https://cdn.brandfetch.io/taurusmutualfund.com/logo",
    Trust: "https://cdn.brandfetch.io/trustmf.com/logo",
    WhiteOak: "https://cdn.brandfetch.io/whiteoakamc.com/logo",
    Quantum: "https://cdn.brandfetch.io/quantumamc.com/logo",
    PPFAS: "https://cdn.brandfetch.io/ppfas.com/logo",
    JMFinancial: "https://cdn.brandfetch.io/jmfinancial.com/logo",
    // L&T: "https://cdn.brandfetch.io/ltfs.com/logo",
    Essel: "https://cdn.brandfetch.io/esselgroup.com/logo",
    Principal: "https://cdn.brandfetch.io/principal.com/logo",
    Sahara: "https://cdn.brandfetch.io/sahara.in/logo",
    Reliance: "https://cdn.brandfetch.io/reliancecapital.co.in/logo",
    Helios: "https://cdn.brandfetch.io/helioscm.com/logo",
    // Mirae: "https://cdn.brandfetch.io/miraeasset.co.in/logo",
    // Nippon: "https://cdn.brandfetch.io/nipponindiaim.com/logo",
    // Invesco: "https://cdn.brandfetch.io/invescomutualfund.com/logo",
    // Union: "https://cdn.brandfetch.io/unionbankofindia.co.in/logo",
    "Bank of India": "https://cdn.brandfetch.io/bankofindia.co.in/logo",
    Groww: "https://cdn.brandfetch.io/groww.in/logo",
    // ITI: "https://cdn.brandfetch.io/itimutualfund.com/logo",
    // Shriram: "https://cdn.brandfetch.io/shrirammf.com/logo",
    Zerodha: "https://cdn.brandfetch.io/zerodha.com/logo",
    "360 One": "https://cdn.brandfetch.io/360.one/logo", // earlier IIFL Wealth, rebranded
    "Bharat Bond": "https://cdn.brandfetch.io/edelweissfin.com/logo",
};

const missingAMCs = new Set();
const DEFAULT_AMC_LOGO = YoloFinanceLogo;

function normalizeRow(raw, id) {
    const schemeCode = raw["Scheme Code"] ?? raw.schemeCode ?? "";
    const isinGrowth =
        raw["ISIN Div Payout/ ISIN Growth"] ?? raw.isinGrowth ?? "";
    const isinReinv = raw["ISIN Div Reinvestment"] ?? raw.isinReinv ?? "";
    const schemeName = raw["Scheme Name"] ?? raw.schemeName ?? "";
    const navStr = raw["Net Asset Value"] ?? raw.nav ?? "";
    const dateStr = raw["Date"] ?? raw.date ?? raw.Date ?? "";

    let dateParsed = null;
    if (dateStr) {
        const tryISO = new Date(dateStr);
        if (!isNaN(tryISO)) {
            dateParsed = tryISO;
        } else {
            const m = String(dateStr).match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
            if (m) {
                const months = {
                    Jan: 0,
                    Feb: 1,
                    Mar: 2,
                    Apr: 3,
                    May: 4,
                    Jun: 5,
                    Jul: 6,
                    Aug: 7,
                    Sep: 8,
                    Oct: 9,
                    Nov: 10,
                    Dec: 11,
                };
                dateParsed = new Date(
                    parseInt(m[3], 10),
                    months[m[2]],
                    parseInt(m[1], 10)
                );
            }
        }
    }

    // Safe category and type extraction
    const category = raw.category ?? raw.Category ?? "Unknown";
    const type = raw.type ?? raw.Type ?? "Unknown";

    // Find AMC logo
    let logo = "";
    let matched = false;
    for (const key in AMC_LOGOS) {
        if (schemeName.toLowerCase().includes(key.toLowerCase())) {
            logo = AMC_LOGOS[key];
            matched = true;
            break;
        }
    }
    if (!matched) {
        const prefix = schemeName.split(" ")[0].replace(/-$/, "");
        missingAMCs.add(prefix);
    }

    return {
        id: id ?? schemeCode ?? Math.random().toString(36).slice(2),
        schemeCode,
        isinGrowth,
        isinReinv,
        schemeName,
        nav: navStr,
        dateText: String(dateStr || ""),
        date: dateParsed,
        category, // now safe
        type, // now safe
        logo,
    };
}

export default function MutualFundDashboard({ apiUrl }) {
    const [mode, setMode] = useState("light");
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [showPurchase, setShowPurchase] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Make sure apiUrl points to backend endpoint that returns nav-final.json
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const arr = Array.isArray(data) ? data : [data];

            const normalized = arr.map((it, idx) => normalizeRow(it, idx + 1));

            setRows(normalized);
        } catch (e) {
            setError(e.message || String(e));
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const CATEGORY_KEYWORDS = {
        All: null,
        "Small Cap": "Small Cap",
        "Mid Cap": "Mid Cap",
        "Large Cap": "Large Cap",
        "Index Fund": "Index",
        ELSS: "ELSS",
        Hybrid: "Hybrid",
        Debt: "Debt",
        Liquid: "Liquid",
        Sectoral: "Sectoral",
        "Balanced Advantage": "Balanced Advantage",
        Arbitrage: "Arbitrage",
        Gilt: "Gilt",
    };

    const filteredRows = useMemo(() => {
        const q = query.toLowerCase();
        const keyword = CATEGORY_KEYWORDS[categoryFilter];

        return rows.filter((r) => {
            const cat = (r.category ?? "").toLowerCase();

            // Category match: All OR keyword present in JSON category
            const matchCategory =
                !keyword || cat.includes(keyword.toLowerCase());

            // Query match: search text against multiple fields
            const matchQuery =
                !q ||
                (r.schemeName || "").toLowerCase().includes(q) ||
                (r.schemeCode || "").toLowerCase().includes(q) ||
                (r.isinGrowth || "").toLowerCase().includes(q) ||
                (r.isinReinv || "").toLowerCase().includes(q) ||
                (r.category || "").toLowerCase().includes(q);

            return matchCategory && matchQuery;
        });
    }, [rows, query, categoryFilter]);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        setOpenModal(true);
    };

    const columns = useMemo(
        () => [
            {
                field: "logo",
                headerName: "",
                width: 60,
                align: "center",
                headerAlign: "center",
                sortable: false,
                renderCell: (params) => (
                    <Box
                        component="img"
                        src={params.value || DEFAULT_AMC_LOGO}
                        alt="AMC Logo"
                        sx={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                        }}
                        onError={(e) => {
                            e.currentTarget.src = DEFAULT_AMC_LOGO; // fallback if logo fails
                        }}
                    />
                ),
            },
            {
                field: "schemeName",
                headerName: "Scheme Name",
                flex: 2.2,
                headerAlign: "center",
                align: "center",
                minWidth: 160,
                renderCell: (params) => (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            height: "100%",
                            maxWidth: "100%",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            "&::-webkit-scrollbar": { height: 6 },
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ lineHeight: 1.2 }}
                        >
                            {params.value}
                        </Typography>
                        <Chip label="IDCW" size="small" variant="outlined" />
                    </Stack>
                ),
            },
            {
                field: "schemeCode",
                headerName: "Scheme Code",
                width: 130,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "isinGrowth",
                headerName: "ISIN Growth",
                flex: 1.2,
                minWidth: 160,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "isinReinv",
                headerName: "ISIN Reinvestment",
                flex: 1.2,
                minWidth: 170,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "nav",
                headerName: "NAV",
                width: 110,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "dateText",
                headerName: "Date",
                width: 130,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "category",
                headerName: "Category",
                flex: 1.5,
                minWidth: 160,
                align: "center",
                headerAlign: "center",
            },
        ],
        []
    );

    // Add more categories here as needed
    const CATEGORY_OPTIONS = [
        "All",
        "Small Cap",
        "Mid Cap",
        "Large Cap",
        "Index Fund",
        "ELSS",
        "Hybrid",
        "Debt",
        "Liquid",
        "Sectoral",
        "Balanced Advantage",
        "Arbitrage",
        "Gilt",
    ];

    return (
        <AppTheme theme={xThemeComponents}>
            <CssBaseline />
            <Box>
                {/* Search and Reload */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                >
                    <TextField
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, code, ISIN, or category..."
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Tooltip title="Reload">
                        <IconButton onClick={fetchData}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/* Category Filter Buttons */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, flexWrap: "wrap" }}
                >
                    {CATEGORY_OPTIONS.map((cat) => (
                        <Button
                            key={cat}
                            variant={
                                categoryFilter === cat
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() => setCategoryFilter(cat)}
                            sx={{ mb: 1 }}
                        >
                            {cat}
                        </Button>
                    ))}
                </Stack>

                {/* DataGrid */}
                <Box sx={{ height: 640, width: "auto" }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick
                        onRowClick={handleRowClick}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                            // sorting: { sortModel: [{ field: "dateText", sort: "desc" }] },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        slots={{ toolbar: GridToolbar }}
                        sx={{
                            border: 0,
                            ".MuiDataGrid-columnHeaders": {
                                backgroundColor: (t) => t.palette.action.hover,
                            },
                            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":
                                {
                                    outline: "none",
                                },
                            borderRadius: 2,
                            cursor: "pointer",
                        }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Showing {filteredRows.length} of {rows.length} items
                </Typography>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={showPurchase}
                autoHideDuration={3000}
                onClose={() => setShowPurchase(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setShowPurchase(false)}
                    sx={{ borderRadius: 2 }}
                >
                    {purchasedItem
                        ? `${purchasedItem} purchased successfully!`
                        : "Item purchased!"}
                </Alert>
            </Snackbar>

            {/* Fund Details Modal */}
            <FundDetailsDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                rowData={selectedRow}
            />
        </AppTheme>
    );
}
