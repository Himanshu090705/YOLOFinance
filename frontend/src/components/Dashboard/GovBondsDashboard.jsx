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

// import GovBondDetailsDialog from "./components/GovBondDetailsDialog";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

// ✅ Normalizer for Gov Bonds
function normalizeBond(raw, id) {
    return {
        id: id ?? raw.bondId ?? Math.random().toString(36).slice(2),
        bondId: raw.bondId ?? "",
        issuer: raw.issuer ?? "",
        bondName: raw.bondName ?? "",
        couponRate: raw.couponRate ?? "",
        maturityDate: raw.maturityDate ? new Date(raw.maturityDate) : null,
        maturityDateText: raw.maturityDate ?? "",
        issueDate: raw.issueDate ?? "",
        ytm: raw.ytm ?? "",
        faceValue: raw.faceValue ?? "",
        currentPrice: raw.currentPrice ?? "",
        category: raw.category ?? "Other",
        issuerLogo: raw.issuerLogo ?? "",
    };
}

export default function GovBondsDashboard({ apiUrl }) {
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

    const [categoryFilter, setCategoryFilter] = useState("All");

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const arr = Array.isArray(data) ? data : [data];
            const normalized = arr.map((it, idx) => normalizeBond(it, idx + 1));
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

    // Unique categories for filter buttons
    const categories = useMemo(() => {
        const types = new Set(rows.map((r) => r.category).filter(Boolean));
        return ["All", ...Array.from(types)];
    }, [rows]);

    // Apply filters + search
    const filteredRows = useMemo(() => {
        let tempRows = rows;
        if (categoryFilter !== "All") {
            tempRows = tempRows.filter((r) =>
                (r.category || "")
                    .toLowerCase()
                    .includes(categoryFilter.toLowerCase())
            );
        }
        if (!query) return tempRows;
        const q = query.toLowerCase();
        return tempRows.filter(
            (r) =>
                (r.bondId || "").toLowerCase().includes(q) ||
                (r.issuer || "").toLowerCase().includes(q) ||
                (r.bondName || "").toLowerCase().includes(q) ||
                (r.category || "").toLowerCase().includes(q)
        );
    }, [rows, query, categoryFilter]);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        setOpenModal(true);
    };

    const columns = useMemo(
        () => [
            {
                field: "bondName",
                headerName: "Bond Name",
                flex: 2.2,
                headerAlign: "center",
                align: "center",
                minWidth: 200,
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
                            "&::-webkit-scrollbar": { height: 10 },
                        }}
                    >
                        {params.row.issuerLogo && (
                            <Box
                                component="img"
                                src={params.row.issuerLogo}
                                alt={params.row.issuer}
                                sx={{
                                    width: 70,
                                    height: 70,
                                    objectFit: "contain",
                                }}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://via.placeholder.com/24?text=🏛️";
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
                field: "bondId",
                headerName: "ISIN",
                align: "center",
                headerAlign: "center",
                width: 150,
            },
            {
                field: "issuer",
                headerName: "Issuer",
                headerAlign: "center",
                align: "center",
                flex: 1.5,
                minWidth: 160,
            },
            {
                field: "couponRate",
                headerName: "Coupon",
                headerAlign: "center",
                align: "center",
                width: 120,
            },
            {
                field: "ytm",
                headerName: "YTM",
                headerAlign: "center",
                align: "center",
                width: 120,
            },
            {
                field: "faceValue",
                headerName: "Face Value",
                headerAlign: "center",
                align: "center",
                width: 130,
            },
            {
                field: "currentPrice",
                headerName: "Price",
                headerAlign: "center",
                align: "center",
                width: 130,
            },
            {
                field: "maturityDateText",
                headerName: "Maturity",
                headerAlign: "center",
                align: "center",
                width: 150,
                sortComparator: (v1, v2, param1, param2) => {
                    const d1 = param1.api.getRow(param1.id).maturityDate;
                    const d2 = param2.api.getRow(param2.id).maturityDate;
                    if (d1 && d2) return d1 - d2;
                    return String(v1).localeCompare(String(v2));
                },
            },
            {
                field: "category",
                headerName: "Category",
                headerAlign: "center",
                align: "center",
                flex: 1,
                minWidth: 150,
            },
        ],
        []
    );

    return (
        <AppTheme theme={xThemeComponents}>
            <CssBaseline />
            <Box>
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
                            placeholder="Search by ISIN, issuer, name, category..."
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

                    {/* Filter Buttons */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={
                                    categoryFilter === cat
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
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
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            slots={{ toolbar: GridToolbar }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: false,
                                    csvOptions: {
                                        fileName: "gov-bonds-dashboard",
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
                        : "Bond purchased!"}
                </Alert>
            </Snackbar>

            {/* <GovBondDetailsDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                rowData={selectedRow}
            /> */}
        </AppTheme>
    );
}
