import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {Alert, Stack, TextField} from "@mui/material";
import {useState} from "react";
import {transfer} from "../../utils/stcWalletSdk";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../store/hooks";

export default function Donate() {
    let {address, amount} = useParams();

    const [donateAddress, setDonateAddress] = useState(address || "")
    const [donateAmount, setDonateAmount] = useState(Number(amount) || 1)
    const accountAddresses = useAppSelector((state: any) => state.wallet.accountAddress)
    const accountAddress = (accountAddresses) ? accountAddresses[0] : ""
    const {t} = useTranslation();
    const handleDonate = async () => {
        await transfer(donateAddress, donateAmount);

    };

    return (
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Stack spacing={2}>

                    <TextField fullWidth id="outlined-basic" value={donateAddress} onChange={(v) => {
                        setDonateAddress(v.target.value)
                    }} label={t("chain_record.receive_address")} variant="outlined"/>
                    <TextField onChange={(v: any) => {
                        setDonateAmount(v.target.value)
                    }} fullWidth id="outlined-basic" label={t("chain_record.stc_amount")} variant="outlined"
                               value={donateAmount}/>


                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handleDonate}>{t("menu.donate")}</Button>
            </CardActions>


            <br/>
            <br/>
            <br/>
            {accountAddress ? <div>
                my received donate url <Alert
                severity="info">{window.location.origin}/{process.env.NODE_ENV === "production" ? "dapps/" : ""}#/donate/{accountAddress}/{donateAmount}</Alert>
            </div> : ""}

            <br/>
            <br/>
            <br/>
        </Card>
    );
}
