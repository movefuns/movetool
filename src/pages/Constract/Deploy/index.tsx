import * as React from 'react';
import Card from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Stack, AlertColor } from "@mui/material";
import { Dropzone, FileItem, FileValidated } from "@dropzone-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fileToBuffer } from '../../../utils/file';
import { deployContract } from '../../../utils/stcWalletSdk';

export default function Donate() {
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

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenTips(false);
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

        // clear files
        setFiles(new Array<FileValidated>());
    };

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5" component="div">
                        {t("constract_deploy.title")}
                    </Typography>

                    <Dropzone onChange={updateFiles} value={files} maxFiles={1} accept=".blob" label={t("constract_deploy.drop_zone_label")}>
                        {files.map((file) => (
                            <FileItem key={file.file.name} {...file} preview />
                        ))}
                    </Dropzone>
                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handleDeploy}>{t("constract_deploy.deploy_btn")}</Button>
            </CardActions>

            <Snackbar open={openTips} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={tipsType} sx={{ width: '100%' }}>
                    {tips}
                </Alert>
            </Snackbar>
        </Card>
    );
}
