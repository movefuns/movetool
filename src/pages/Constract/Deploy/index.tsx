import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Dropzone, FileItem, FileValidated } from "@dropzone-ui/react";
import {Alert, Stack, TextField} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import {useState} from "react";
import {transfer} from "../../../utils/stcWalletSdk";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../../store/hooks";

export default function Donate() {
    let {address, amount} = useParams();
    const accountAddresses = useAppSelector((state: any) => state.wallet.accountAddress)
    const {t} = useTranslation();

    const [errorTips, setErrorTips] = useState("")
    const [openErrorTips, setOpenErrorTips] = useState(false);

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
             setErrorTips(t("chain_record.please_upload_file"))
             setOpenErrorTips(true)
             return
         }

        const file = files[0]
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            const result = fileReader.result as string
            const data = JSON.parse(result)
            const {address, amount} = data
            await transfer(address, amount);
        }
    };

    return (
        <Card sx={{minWidth: 275}}>
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
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {errorTips}
                </Alert>
            </Snackbar>
        </Card>
    );
}
