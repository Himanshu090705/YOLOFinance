import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Snackbar,
    Stack,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AppTheme from "../shared-theme/AppTheme";
import { useCartStore } from "../../store/useCartStore";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "./theme/customizations";
import axios from "axios";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

function normalizeRow(raw) {
    return {
        id: raw.schemeCode, // ✅ use schemeCode as row id
        schemeCode: raw.schemeCode,
        schemeName: raw.schemeName ?? "",
        nav: raw.nav ?? 0,
        units: raw.units ?? 0,
        amount: raw.amount ?? 0,
        profit: raw.nav * raw.units - raw.amount,
    };
}

export default function MutualFundDashboardPurchased() {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [cancelInput, setCancelInput] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const cart = useCartStore((state) => state.cart);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    "http://localhost:4000/api/investments/mf-get",
                    { withCredentials: true }
                );
                const arr = Array.isArray(res.data.investments)
                    ? res.data.investments
                    : [];
                const investments = arr.map((raw, idx) =>
                    normalizeRow(raw, idx)
                );

                setRows(investments);
            } catch (err) {
                console.error(err);
                setSnackbar({
                    open: true,
                    message: "Failed to load investments",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const filteredRows = useMemo(() => {
        if (!query) return rows;
        const q = query.toLowerCase();
        return rows.filter(
            (r) =>
                (r.schemeName || "").toLowerCase().includes(q) ||
                (r.schemeCode || "").toLowerCase().includes(q)
        );
    }, [rows, query]);

    const handleCancelClick = (row) => {
        setSelectedRow(row);
        setCancelInput("");
        setOpenDialog(true);
    };

    const handleConfirmCancel = async () => {
        if (cancelInput.toLowerCase() === "cancel" && selectedRow) {
            try {
                setLoading(true);
                const res = await axios.post(
                    "http://localhost:4000/api/investments/mf-cancel",
                    { schemeCode: selectedRow.schemeCode }, // ✅ send schemeCode instead of id
                    { withCredentials: true }
                );

                if (res.data.success) {
                    // Remove from UI
                    setRows((prev) =>
                        prev.filter((r) => r.id !== selectedRow.id)
                    );

                    setSnackbar({
                        open: true,
                        message: "SIP cancelled successfully",
                        severity: "success",
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: res.data.message || "Failed to cancel SIP",
                        severity: "error",
                    });
                }
            } catch (err) {
                console.error(err);
                setSnackbar({
                    open: true,
                    message: "Error cancelling SIP",
                    severity: "error",
                });
            } finally {
                setLoading(false);
                setOpenDialog(false);
                setSelectedRow(null);
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                field: "schemeName",
                headerName: "Scheme Name",
                flex: 3,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "schemeCode",
                headerName: "Scheme Code",
                flex: 0.7,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "amount",
                headerName: "Investment",
                flex: 0.7,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "nav",
                headerName: "NAV",
                flex: 0.7,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "units",
                headerName: "Units",
                flex: 0.8,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "cancel",
                headerName: "Cancel SIP",
                flex: 1,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelClick(params.row)}
                    >
                        Cancel SIP
                    </Button>
                ),
            },
        ],
        []
    );

    return (
        <AppTheme theme={xThemeComponents}>
            <CssBaseline />

            <Box>
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
                        placeholder="Search by name, code or ISIN..."
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
                </Stack>

                <Box sx={{ height: 640, width: "auto" }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick
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
                                    fileName: "mutual-fund-dashboard",
                                },
                            },
                        }}
                        sx={{
                            border: 0,
                            ".MuiDataGrid-columnHeaders": {
                                backgroundColor: (t) => t.palette.action.hover,
                            },
                            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":
                                { outline: "none" },
                            borderRadius: 2,
                        }}
                    />
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

            {/* Cancel Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Cancel SIP</DialogTitle>
                <DialogContent>
                    <Typography mb={2}>
                        To confirm cancellation of{" "}
                        <strong>{selectedRow?.schemeName}</strong>, type{" "}
                        <strong>cancel</strong> below:
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        placeholder="Type cancel to confirm"
                        value={cancelInput}
                        onChange={(e) => setCancelInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={cancelInput.toLowerCase() !== "cancel"}
                        onClick={handleConfirmCancel}
                    >
                        Confirm Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
}
