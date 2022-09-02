import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { deployContract } from "../../../utils/stcWalletSdk";
import { useTranslation } from "react-i18next";
import { WasmFs } from '@wasmer/wasmfs'
import { Git, MovePackage } from '@yubing744/move-js'
import { TokenPackage } from './TokenPackage'
import { useAppSelector } from '../../../store/hooks'
import {firstToUpper, isTokenName} from "../../../utils/common";

const numReg = /^\d{1,}$/;
const numPattern = new RegExp(numReg);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function Issue() {
    const [tokenName, setTokenName] = useState("MyToken")
    const [tokenPrecision, setTokenPrecision] = useState("9")
    const accountAddresses = useAppSelector((state:any) => state.wallet.accountAddress)
    const accountAddress = (accountAddresses)? accountAddresses[0]: ""
    let [initMint, setInitMint] = useState("100000000")

    const [errorTips, setErrorTips] = useState("")
    const [openErrorTips, setOpenErrorTips] = useState(false);

    const [successTips, setSuccessTips] = useState("")
    const [openSuccessTips, setSuccessErrorTips] = useState(false);

    const {t} = useTranslation();

    const handleIssueToken = async () => {
        if (accountAddress === "") {
            setErrorTips(t("issue_token.error_tips.token_address_required"))
            setOpenErrorTips(true)
            return
        }

        if (tokenName === "") {
            setErrorTips(t("issue_token.error_tips.token_name_required"))
            setOpenErrorTips(true)
            return
        }

        if (tokenPrecision === "") {
            setErrorTips(t("issue_token.error_tips.token_precision_required"))
            setOpenErrorTips(true)
            return
        }

        if (isNaN(parseInt(tokenPrecision))) {
            setErrorTips(t("issue_token.error_tips.token_precision_must_be_number"))
            setOpenErrorTips(true)
            return
        }

        if (parseInt(tokenPrecision) < 0 || parseInt(tokenPrecision) > 38) {
            setErrorTips(t("issue_token.error_tips.token_precision_range"))
            setOpenErrorTips(true)
            return
        }

        if (!numPattern.test(initMint)) {
            setErrorTips(t("issue_token.error_tips.token_mint_amount_invalid"))
            setOpenErrorTips(true)
            return
        }

        initMint = initMint.replace(/\b(0+)/gi,"");

        if (initMint === "" || isNaN(parseInt(initMint))) {
            initMint = "0"
        }

        try {
            const wasmfs = new WasmFs()
            const git = new Git(wasmfs)
            const tokenPackage = new TokenPackage(wasmfs, accountAddress, tokenName, parseInt(tokenPrecision), initMint)

            const starcoinFrameworkURL =  "/data/starcoin-framework.zip"
            await git.download(starcoinFrameworkURL, "/workspace/starcoin-framework")
            tokenPackage.export("/workspace/my-token")

            const mp = new MovePackage(wasmfs, {
                packagePath: "/workspace/my-token",
                test: false,
                alias: new Map([
                    ["StarcoinFramework", "/workspace/starcoin-framework"]
                ]),
                initFunction: `${accountAddress}::${tokenName}::init`
            })

            await mp.build()
            const blobBuf = wasmfs.fs.readFileSync("/workspace/my-token/target/starcoin/release/package.blob") as Buffer;
            const transactionHash = await deployContract(blobBuf)

            setSuccessTips(`Deploy token ${tokenName} success, please wait for the transaction to be confirmed, the transaction hash: ${transactionHash}`)
            setSuccessErrorTips(true);
        } catch (err: any) {
            setErrorTips(t(err.message))
            setOpenErrorTips(true)
        }

    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorTips(false);
        setSuccessErrorTips(false);
    };

    return (
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5" component="div">
                        {t("issue_token.title")}
                    </Typography>

                    <TextField fullWidth id="token_address" value={accountAddress} autoFocus={true}
                               label={t("issue_token.token_address")} variant="outlined" disabled/>

                    <TextField fullWidth id="token_name" value={tokenName} onChange={(v) => {

                        setTokenName(firstToUpper(v.target.value))
                    }} label={t("issue_token.token_name")} variant="outlined" error={!isTokenName(tokenName)}  helperText={isTokenName(tokenName) ? "": t("issue_token.token_name_alert")}/>

                    <TextField fullWidth id="token_precision" value={tokenPrecision} onChange={(v: any) => {
                        setTokenPrecision(v.target.value)
                    }} label={t("issue_token.token_precision")} variant="outlined"/>

                    <TextField fullWidth id="init_mint" value={initMint} onChange={(v: any) => {
                        setInitMint(v.target.value)
                    }} label={t("issue_token.init_mint")} variant="outlined"/>

                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handleIssueToken}>{t("issue_token.submit_btn")}</Button>
            </CardActions>

            <Snackbar open={openSuccessTips} autoHideDuration={6000} onClose={handleClose}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                    {successTips}
                </Alert>
            </Snackbar>

            <Snackbar open={openErrorTips} autoHideDuration={6000} onClose={handleClose}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {errorTips}
                </Alert>
            </Snackbar>
        </Card>
    )
}