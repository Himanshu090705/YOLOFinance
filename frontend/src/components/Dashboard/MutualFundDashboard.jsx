import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Chip,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppTheme from "../shared-theme/AppTheme";
import { useCartStore } from "../../store/useCartStore";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";

import { Button } from "@mui/material";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function normalizeRow(raw, id) {
  // Safely read properties with spaces and normalize types
  const schemeCode = raw["Scheme Code"] ?? raw.schemeCode ?? "";
  const isinGrowth =
    raw["ISIN Div Payout/ ISIN Growth"] ?? raw.isinGrowth ?? "";
  const isinReinv = raw["ISIN Div Reinvestment"] ?? raw.isinReinv ?? "";
  const schemeName = raw["Scheme Name"] ?? raw.schemeName ?? "";
  const navStr = raw["Net Asset Value"] ?? raw.nav ?? "";
  const dateStr = raw["Date"] ?? raw.date ?? raw.Date ?? "";

  // Keep original date text but also a Date object for sorting
  let dateParsed = null;
  if (dateStr) {
    // Supports formats like 20-Aug-2025 or ISO
    const tryISO = new Date(dateStr);
    if (!isNaN(tryISO)) {
      dateParsed = tryISO;
    } else {
      // Attempt parsing DD-MMM-YYYY
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
  };
}

export default function MutualFundDashboard({ apiUrl }) {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Expecting an array; if a single object is returned, wrap it
      const arr = Array.isArray(data) ? data : [data];
      const normalized = arr.map((it, idx) => normalizeRow(it, idx + 1));
      setRows(normalized);
    } catch (e) {
      setError(e.message || String(e));
      // Fallback to mock data for usability
      setRows(makeMockRows(50));
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        (r.schemeName || "").toLowerCase().includes(q) ||
        (r.schemeCode || "").toLowerCase().includes(q) ||
        (r.isinGrowth || "").toLowerCase().includes(q) ||
        (r.isinReinv || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

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
              maxWidth: "100%", // keep within column
              overflowX: "scroll", // scroll horizontally if too long
              whiteSpace: "nowrap", // prevent wrapping
              "&::-webkit-scrollbar": {
                height: 6, // small scrollbar
              },
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
        align: "center",
        headerAlign: "center",
        headerName: "Scheme Code",
        width: 130,
      },
      {
        field: "isinGrowth",
        headerName: "ISIN Growth",
        headerAlign: "center",
        align: "center",
        flex: 1.2,
        minWidth: 160,
      },
      {
        field: "isinReinv",
        headerName: "ISIN Reinvestment",
        headerAlign: "center",
        align: "center",
        flex: 1.2,
        minWidth: 170,
      },
      {
        field: "nav",
        headerName: "NAV",
        headerAlign: "center",
        align: "center",
        width: 110,
        type: "String",
        valueFormatter: (p) => p.value,
      },
      {
        field: "dateText",
        headerName: "Date",
        headerAlign: "center",
        align: "center",
        width: 130,
        sortComparator: (v1, v2, param1, param2) => {
          const d1 = param1.api.getRow(param1.id).date;
          const d2 = param2.api.getRow(param2.id).date;
          if (d1 && d2) return d1 - d2;
          return String(v1).localeCompare(String(v2));
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        width: 150,
        sortable: false,
        filterable: false,
        disableExport: true,
        renderCell: (params) => {
          const addToCart = useCartStore((s) => s.addToCart);
          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                addToCart(params.row); // ✅ push fund info to stores
              }}
            >
              Buy Now
            </Button>
          );
        },
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

            <Stack direction="row" spacing={1} justifyContent="flex-end">
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
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                sorting: { sortModel: [{ field: "dateText", sort: "desc" }] },
              }}
              pageSizeOptions={[10, 25, 50]}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false, // we use our own search box
                  csvOptions: { fileName: "mutual-fund-dashboard" },
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
    </AppTheme>
  );
}
