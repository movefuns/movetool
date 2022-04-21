import {useTheme} from "@mui/material/styles";
import {ColorModeContext} from "../../utils/context";
import React from "react";
import {IconButton} from "@mui/material";
import {Brightness4Sharp, Brightness7Sharp} from "@mui/icons-material";

export default function ThemeChange() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color='inherit'>
        {theme.palette.mode === 'dark' ? <Brightness7Sharp/> : <Brightness4Sharp/>}
    </IconButton>
}