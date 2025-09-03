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
import axios from "axios";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function normalizeRow(raw, id) {
  return {
    id: raw._id ?? id,
    schemeName: raw.schemeName ?? "",
    nav: raw.nav ?? 0,
    units: raw.units ?? 0,
    amount: raw.amount ?? 0,
    schemeCode: raw.schemeCode ?? "",
  };
}

export default function MutualFundDashboardPurchased() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [cartData, setCartData] = useState([]);
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/investments/mf-get",
          {
            withCredentials: true,
          }
        );
        const arr = Array.isArray(res.data.investments)
          ? res.data.investments
          : [];
        const investments = arr.map((raw, idx) => normalizeRow(raw, idx));

        setRows(investments);
        setCartData(investments);
      } catch (err) {
        console.error(err);
        setError("Failed to load investments");
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
        (r.schemeCode || "").toLowerCase().includes(q) ||
        (r.nav || "").toLowerCase().includes(q) ||
        (r.units || "").toLowerCase().includes(q) ||
        r.frequency ||
        ""
    );
  }, [rows, query]);

  const columns = useMemo(
    () => [
      {
        field: "schemeName",
        headerName: "Scheme Name",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "schemeCode",
        headerName: "Scheme Code",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "amount",
        headerName: "Investment",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "nav",
        headerName: "NAV",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "units",
        headerName: "Units",
        flex: 1,
        align: "center",
        headerAlign: "center",
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
