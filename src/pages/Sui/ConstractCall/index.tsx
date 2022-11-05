import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, Autocomplete, TextField, CircularProgress, Box, AlertColor, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
 
export default function SuiConstractCall() {
    const { t } = useTranslation();

    const [tipsType, setTipsType] = useState<AlertColor>("error")
    const [tips, setTips] = useState("")
    const [openTips, setOpenTips] = useState(false);

    const showSuccess = function (msg: string) {
        setTipsType("success")
        setTips(msg)
        setOpenTips(true)
    }

    const showError = function (msg: string) {
        setTipsType("error")
        setTips(msg)
        setOpenTips(true)
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            Hello World
        </Card >
    );
}
