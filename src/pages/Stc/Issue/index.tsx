import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Chip, Stack, TextField} from "@mui/material";
import {useState} from "react";
import {peerTransfer_with_metadata_v2} from "../../../utils/stcWalletSdk";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function Issue() {
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState(1)
    const [context, setContext] = useState("")
    const [txHash, setTxHash] = useState("")
    const {t} = useTranslation();
    let navigate = useNavigate();
    const handleRecord = async () => {
        const data = await peerTransfer_with_metadata_v2(address, amount, context);
        setTxHash(data)
    };

    const handleQuery = () => {
        navigate("/chain/record/detail", {})
    }

    return (
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5" component="div">
                        {t("issue_token.title")}
                    </Typography>

                    <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                        {t("chain_record.desc")}
                    </Typography>

                    <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        label={t("chain_record.content")}
                        value={context}
                        onChange={(v: any) => {
                            setContext(v.target.value)
                        }}
                        multiline
                        rows={8}
                    />

                    <TextField fullWidth id="outlined-basic" value={address} onChange={(v) => {
                        setAddress(v.target.value)
                    }} label={t("chain_record.receive_address")} variant="outlined"/>

                    <TextField onChange={(v: any) => {
                        setAmount(v.target.value)
                    }} fullWidth id="outlined-basic" label={t("chain_record.stc_amount")} variant="outlined"
                               value={amount}/>

                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handleRecord}>{t("chain_record.record_on")}</Button>
            </CardActions>
        </Card>
    )
}