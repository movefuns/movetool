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
import { WasmFs } from '@wasmer/wasmfs'
import { Git, MovePackage } from '@yubing744/move-js'

export default function Issue() {
    const [tokenName, setTokenName] = useState("MyToken")
    const [tokenPrecision, setTokenPrecision] = useState(3)
    const {t} = useTranslation();

    const handleIssueToken = async () => {
        let wasmfs = new WasmFs()
        let git = new Git(wasmfs)
    
        await git.download("/data/starcoin-framework.zip", "/workspace/starcoin-framework")
        await git.download("/data/my-counter.zip", "/workspace/my-counter")
    
        let mp = new MovePackage(wasmfs, "/workspace/my-counter", false, new Map([
          ["StarcoinFramework", "/workspace/starcoin-framework"]
        ]))
        
        await mp.build()
    
        let blobBuf = wasmfs.fs.readFileSync("/workspace/my-counter/target/starcoin/release/package.blob")
        let base64Data = blobBuf.toString("base64")
    };

    return (
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5" component="div">
                        {t("issue_token.title")}
                    </Typography>

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