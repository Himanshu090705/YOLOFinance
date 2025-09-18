import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CssBaseline,
    IconButton,
    InputAdornment,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography,
    createTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AppTheme from "../shared-theme/AppTheme";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "./theme/customizations";

import InsuranceDetailsDialog from "./components/InsuranceDetailsDialog";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

// ✅ Normalizer includes insurerLogo
function normalizeRow(raw, id) {
    return {
        id: id ?? raw.policyId ?? Math.random().toString(36).slice(2),
        policyId: raw.policyId ?? "",
        insurer: raw.insurer ?? "",
        planName: raw.planName ?? "",
        planType: raw.planType ?? "",
        premium: raw.premium ?? "",
        coverage: raw.coverage ?? "",
        claimRatio: raw.claimRatio ?? "",
        premiumFrequency: raw.premiumFrequency ?? "",
        lastUpdated: raw.lastUpdated ? new Date(raw.lastUpdated) : null,
        lastUpdatedText: raw.lastUpdated ?? "",
        insurerLogo: raw.insurerLogo ?? "", // 👈 added
    };
}

export default function InsuranceDashboard({ apiUrl }) {
    const [mode, setMode] = useState("light");
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState("");

    const [showPurchase, setShowPurchase] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [planTypeFilter, setPlanTypeFilter] = useState("All");

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
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

    // Get unique plan types for filter buttons
    const planTypes = useMemo(() => {
        const types = new Set(rows.map((r) => r.planType).filter(Boolean));
        return ["All", ...Array.from(types)];
    }, [rows]);

    // Update filteredRows to include planTypeFilter
    const filteredRows = useMemo(() => {
        let tempRows = rows;
        if (planTypeFilter !== "All") {
            tempRows = tempRows.filter((r) =>
                (r.planType || "")
                    .toLowerCase()
                    .includes(planTypeFilter.toLowerCase())
            );
        }
        if (!query) return tempRows;
        const q = query.toLowerCase();
        return tempRows.filter(
            (r) =>
                (r.policyId || "").toLowerCase().includes(q) ||
                (r.insurer || "").toLowerCase().includes(q) ||
                (r.planName || "").toLowerCase().includes(q) ||
                (r.planType || "").toLowerCase().includes(q) ||
                (r.coverage || "").toLowerCase().includes(q)
        );
    }, [rows, query, planTypeFilter]);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        setOpenModal(true);
    };

    const columns = useMemo(
        () => [
            {
                field: "planName",
                headerName: "Plan Name",
                flex: 2.2,
                headerAlign: "center",
                align: "center",
                minWidth: 200,
                renderCell: (params) => (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        // justifyContent="center"
                        sx={{
                            height: "100%",
                            maxWidth: "100%",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            "&::-webkit-scrollbar": { height: 10 },
                        }}
                    >
                        {params.row.insurerLogo && (
                            <Box
                                component="img"
                                src={params.row.insurerLogo}
                                alt={params.row.insurer}
                                sx={{
                                    width: 70,
                                    height: 70,
                                    // borderRadius: "50%",
                                    objectFit: "contain",
                                }}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://via.placeholder.com/24?text=🏦"; // fallback
                                }}
                            />
                        )}
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ lineHeight: 1.2 }}
                        >
                            {params.value}
                        </Typography>
                    </Stack>
                ),
            },
            {
                field: "policyId",
                headerName: "Policy ID",
                align: "center",
                headerAlign: "center",
                width: 130,
            },
            {
                field: "insurer",
                headerName: "Insurer",
                headerAlign: "center",
                align: "center",
                flex: 1.5,
                minWidth: 160,
            },
            {
                field: "premium",
                headerName: "Premium",
                headerAlign: "center",
                align: "center",
                width: 150,
            },
            {
                field: "coverage",
                headerName: "Coverage",
                headerAlign: "center",
                align: "center",
                width: 150,
            },
            {
                field: "claimRatio",
                headerName: "Claim Ratio",
                headerAlign: "center",
                align: "center",
                width: 130,
            },
            {
                field: "lastUpdatedText",
                headerName: "Last Updated",
                headerAlign: "center",
                align: "center",
                width: 150,
                sortComparator: (v1, v2, param1, param2) => {
                    const d1 = param1.api.getRow(param1.id).lastUpdated;
                    const d2 = param2.api.getRow(param2.id).lastUpdated;
                    if (d1 && d2) return d1 - d2;
                    return String(v1).localeCompare(String(v2));
                },
            },
        ],
        []
    );

    return (
        <AppTheme theme={xThemeComponents}>
            <CssBaseline />
            <Box>
                {/* Filter Buttons for Plan Type */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {planTypes.map((type) => (
                        <Button
                            key={type}
                            variant={
                                planTypeFilter === type
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() => setPlanTypeFilter(type)}
                        >
                            {type}
                        </Button>
                    ))}
                </Stack>

                <Box elevation={3} sx={{ borderRadius: 3 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                    >
                        <TextField
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by policy, insurer, plan type..."
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

                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                        >
                            <Tooltip title="Reload">
                                <IconButton onClick={fetchData}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>

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
                                sorting: {
                                    sortModel: [
                                        {
                                            field: "lastUpdatedText",
                                            sort: "desc",
                                        },
                                    ],
                                },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            slots={{ toolbar: GridToolbar }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: false,
                                    csvOptions: {
                                        fileName: "insurance-dashboard",
                                    },
                                    printOptions: {
                                        disableToolbarButton: false,
                                    },
                                },
                            }}
                            sx={{
                                border: 0,
                                ".MuiDataGrid-columnHeaders": {
                                    backgroundColor: (t) =>
                                        t.palette.action.hover,
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
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Showing {filteredRows.length} of {rows.length} items
                    </Typography>
                </Stack>
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

            <InsuranceDetailsDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                rowData={selectedRow}
            />
        </AppTheme>
    );
}
