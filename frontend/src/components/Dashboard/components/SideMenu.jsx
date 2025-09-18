import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/YoloFinance_transparent-.png"; // Adjust path if needed

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: "border-box",
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: "border-box",
    },
});

export default function SideMenu() {
    const token = Cookies.get("id_token");
    const [details, setDetails] = useState({});

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setDetails(decoded);
        }
    }, [token]); //
    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: "none", md: "block" },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: "background.paper",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: -17,
                    mt: -5,
                    overflow:"hidden"
                }}
            >
                <Link to="/dashboard">
                    <img
                        src={Logo}
                        alt="YOLOFinance Logo"
                        style={{
                            height: 270,
                            width: "auto",
                            cursor: "pointer",
                        }}
                    />
                </Link>
            </Box>
            <Divider />
            <Box
                sx={{
                    overflow: "auto",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <MenuContent />
            </Box>
        </Drawer>
    );
}
