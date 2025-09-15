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

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

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

  return {
    id: id ?? schemeCode ?? Math.random().toString(36).slice(2),
    schemeCode,
    isinGrowth,
    isinReinv,
    schemeName,
    nav: navStr,
    dateText: String(dateStr || ""),
    date: dateParsed,
    category: "Unknown", // will fill later
    type: "Unknown",
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
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [data];

      const normalized = arr.map((it, idx) => normalizeRow(it, idx + 1));

      // fetch categories in parallel
      const withMeta = await Promise.all(
        normalized.map(async (row) => {
          try {
            if (!row.schemeCode) return row;
            const metaRes = await fetch(
              `https://api.mfapi.in/mf/${row.schemeCode}`
            );
            const metaJson = await metaRes.json();
            return {
              ...row,
              category: metaJson?.meta?.scheme_category || "Unknown",
              type: metaJson?.meta?.scheme_type || "Unknown",
            };
          } catch {
            return row;
          }
        })
      );

      setRows(withMeta);
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

  const filteredRows = useMemo(() => {
    let tempRows = rows;
    if (categoryFilter !== "All") {
  tempRows = tempRows.filter((r) =>
    r.category?.toLowerCase().includes(categoryFilter.toLowerCase())
  );
}

    
    else if (!query) return tempRows;
    const q = query.toLowerCase();
    return tempRows.filter(
      (r) =>
        (r.schemeName || "").toLowerCase().includes(q) ||
        (r.schemeCode || "").toLowerCase().includes(q) ||
        (r.isinGrowth || "").toLowerCase().includes(q) ||
        (r.isinReinv || "").toLowerCase().includes(q) ||
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
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              {params.value}
            </Typography>
            <Chip label="IDCW" size="small" variant="outlined" />
          </Stack>
        ),
      },
      { field: "schemeCode", headerName: "Scheme Code", width: 130, align: "center", headerAlign: "center" },
      { field: "isinGrowth", headerName: "ISIN Growth", flex: 1.2, minWidth: 160, align: "center", headerAlign: "center" },
      { field: "isinReinv", headerName: "ISIN Reinvestment", flex: 1.2, minWidth: 170, align: "center", headerAlign: "center" },
      { field: "nav", headerName: "NAV", width: 110, align: "center", headerAlign: "center" },
      { field: "dateText", headerName: "Date", width: 130, align: "center", headerAlign: "center" },
      { field: "category", headerName: "Category", flex: 1.5, minWidth: 160, align: "center", headerAlign: "center" },
    ],
    []
  );

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
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {["All", "Small Cap", "Mid Cap", "Large Cap"].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "contained" : "outlined"}
              onClick={() => setCategoryFilter(cat)}
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
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: "dateText", sort: "desc" }] },
            }}
            pageSizeOptions={[10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
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

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
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
