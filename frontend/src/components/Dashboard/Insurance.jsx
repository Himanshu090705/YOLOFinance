import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CssBaseline,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
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

import FundDetailsDialog from "./components/FundDetailsDialog"; // 🔄 You can create InsuranceDetailsDialog if needed

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

// ✅ Normalize Insurance Policy Row
function normalizeRow(raw, id) {
  const policyNumber = raw["Policy Number"] ?? raw.policyNumber ?? "";
  const policyName = raw["Policy Name"] ?? raw.policyName ?? "";
  const policyType = raw["Policy Type"] ?? raw.policyType ?? "";
  const premium = raw["Premium"] ?? raw.premium ?? "";
  const coverageAmount = raw["Coverage Amount"] ?? raw.coverageAmount ?? "";
  const startDateStr = raw["Start Date"] ?? raw.startDate ?? "";
  const maturityDateStr = raw["Maturity Date"] ?? raw.maturityDate ?? "";
  const status = raw["Status"] ?? raw.status ?? "Active";

  // Parse dates
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const tryISO = new Date(dateStr);
    return isNaN(tryISO) ? null : tryISO;
  };

  return {
    id: id ?? policyNumber ?? Math.random().toString(36).slice(2),
    policyNumber,
    policyName,
    policyType,
    premium,
    coverageAmount,
    startDate: parseDate(startDateStr),
    startDateText: String(startDateStr || ""),
    maturityDate: parseDate(maturityDateStr),
    maturityDateText: String(maturityDateStr || ""),
    status,
  };
}

export default function Insurance({ apiUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch Insurance Data
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

  // Search filter
  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        (r.policyName || "").toLowerCase().includes(q) ||
        (r.policyNumber || "").toLowerCase().includes(q) ||
        (r.policyType || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpenModal(true);
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        field: "policyName",
        headerName: "Policy Name",
        flex: 2,
        headerAlign: "center",
        align: "center",
        minWidth: 160,
      },
      {
        field: "policyNumber",
        headerName: "Policy Number",
        headerAlign: "center",
        align: "center",
        width: 150,
      },
      {
        field: "policyType",
        headerName: "Type",
        headerAlign: "center",
        align: "center",
        width: 130,
      },
      {
        field: "premium",
        headerName: "Premium (₹)",
        headerAlign: "center",
        align: "center",
        width: 150,
      },
      {
        field: "coverageAmount",
        headerName: "Coverage Amount (₹)",
        headerAlign: "center",
        align: "center",
        width: 180,
      },
      {
        field: "startDateText",
        headerName: "Start Date",
        headerAlign: "center",
        align: "center",
        width: 140,
        sortComparator: (v1, v2, param1, param2) => {
          const d1 = param1.api.getRow(param1.id).startDate;
          const d2 = param2.api.getRow(param2.id).startDate;
          if (d1 && d2) return d1 - d2;
          return String(v1).localeCompare(String(v2));
        },
      },
      {
        field: "maturityDateText",
        headerName: "Maturity Date",
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
        field: "status",
        headerName: "Status",
        headerAlign: "center",
        align: "center",
        width: 120,
      },
    ],
    []
  );

  return (
    <AppTheme theme={xThemeComponents}>
      <CssBaseline />

      <Box>
        <Box elevation={3} sx={{ borderRadius: 3 }}>
          {/* Top Bar: Search + Reload */}
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
              placeholder="Search by policy name, number or type..."
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

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Reload">
                <IconButton onClick={fetchData}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Data Table */}
          <Box sx={{ height: 640, width: "auto" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                sorting: {
                  sortModel: [{ field: "maturityDateText", sort: "asc" }],
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                  csvOptions: { fileName: "insurance-dashboard" },
                  printOptions: { disableToolbarButton: false },
                },
              }}
              sx={{
                border: 0,
                ".MuiDataGrid-columnHeaders": {
                  backgroundColor: (t) => t.palette.action.hover,
                },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
                borderRadius: 2,
                cursor: "pointer",
              }}
            />
          </Box>
        </Box>

        {/* Footer count */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRows.length} of {rows.length} policies
          </Typography>
        </Stack>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Policy Details Dialog */}
      <FundDetailsDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        rowData={selectedRow}
      />
    </AppTheme>
  );
}
