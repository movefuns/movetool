import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Chip, Stack, TextField} from "@mui/material";
import {useState} from "react";
import {deployContract} from "../../../utils/stcWalletSdk";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { useDispatch, useSelector } from 'react-redux'
import { WasmFs } from '@wasmer/wasmfs'
import { Git, MovePackage } from '@yubing744/move-js'
import { TokenPackage } from './TokenPackage'

export default function Issue() {
    const [tokenName, setTokenName] = useState("MyToken")
    const [tokenPrecision, setTokenPrecision] = useState(3)
    const accountAddress = useSelector((state:any) => state.wallet.accountAddress)

    const {t} = useTranslation();

    const handleIssueToken = async () => {
        const wasmfs = new WasmFs()
        const git = new Git(wasmfs)
        const tokenPackage = new TokenPackage(wasmfs, accountAddress, tokenName, tokenPrecision)
    
        await git.download("/data/starcoin-framework.zip", "/workspace/starcoin-framework")
        tokenPackage.export("/workspace/my-token")
    
        const mp = new MovePackage(wasmfs, "/workspace/my-token", false, new Map([
          ["StarcoinFramework", "/workspace/starcoin-framework"]
        ]))
        
        await mp.build()
    
        const blobBuf = wasmfs.fs.readFileSync("/workspace/my-token/target/starcoin/release/package.blob") as Buffer;
        const transactionHash = await deployContract(blobBuf)
        alert("Deploy token success, transactionHash: " + transactionHash)
    };

    return (
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5" component="div">
                        {t("issue_token.title")}
                    </Typography>

                    <TextField fullWidth id="token_address" value={accountAddress} label={t("issue_token.token_address")} variant="outlined" disabled/>

                    <TextField fullWidth id="token_name" value={tokenName} onChange={(v) => {
                        setTokenName(v.target.value)
                    }} label={t("issue_token.token_name")} variant="outlined"/>

                    <TextField fullWidth id="token_precision" value={tokenPrecision} onChange={(v:any) => {
                        setTokenPrecision(v.target.value)
                    }} label={t("issue_token.token_precision")} variant="outlined"/>

                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handleIssueToken}>{t("issue_token.submit_btn")}</Button>
            </CardActions>
        </Card>
    )
}