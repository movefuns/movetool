import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Dropzone, FileItem, FileValidated } from "@dropzone-ui/react";
import { Alert, Stack, TextField, AlertColor } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import { useState } from "react";
import { transfer } from "../../../utils/stcWalletSdk";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../store/hooks";
import { fileToBuffer } from '../../../utils/file';
import { deployContract } from '../../../utils/stcWalletSdk';

export default function Donate() {
    const { t } = useTranslation();

    const [tipsType, setTipsType] = useState<AlertColor>("error")
    const [errorTips, setErrorTips] = useState("")
    const [openErrorTips, setOpenErrorTips] = useState(false);

    const showSuccess = function (msg: string) {
        setTipsType("success")
        setErrorTips(msg)
        setOpenErrorTips(true)
    }

    const showError = function (msg: string) {
        setTipsType("error")
        setErrorTips(msg)
        setOpenErrorTips(true)
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorTips(false);
    };

    const [files, setFiles] = React.useState(new Array<FileValidated>());
    const updateFiles = (incommingFiles: FileValidated[]) => {
        setFiles(incommingFiles);
    };

    const handleDeploy = async () => {
        if (files.length === 0) {
            showError(t("constract_deploy.please_upload_file"))
            return
        }

        try {
            const file = files[0]
            const blobBuf = await fileToBuffer(file.file);
            const transactionHash = await deployContract(blobBuf)

            showSuccess(`Deploy constract success, please wait for the transaction to be confirmed, the transaction hash: ${transactionHash}`);
        } catch (err: any) {
            showError(t(err.message))
        }
    };

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Dropzone onChange={updateFiles} value={files}>
                        {files.map((file) => (
                            <FileItem {...file} preview />
                        ))}
                    </Dropzone>
                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handleDeploy}>{t("menu.constract_deploy")}</Button>
            </CardActions>

            <Snackbar open={openErrorTips} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={tipsType} sx={{ width: '100%' }}>
                    {errorTips}
                </Alert>
            </Snackbar>
        </Card>
    );
}
