import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, Autocomplete, TextField, CircularProgress, Box, AlertColor, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAddressCode } from '../../../utils/sdk';
import { useEffect, useState } from "react";
import CodeContent from './CodeContent';

export default function ConstractCall() {

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


    const [address, setAddress] = useState('0x1');
    const [modlueId, setModuleId] = useState('all');

    const [addressOptions, setAddressOptions] = useState(['0x1'])
    const [moduleOptions, setModuleOptions] = useState(['all'])

    const [codes, setCodes] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const accountsChanged = (accounts: any) => {
        setCodes([])
        setAddress(window.starcoin.selectedAddress)
    }

    const chainChanged = (chainId: any) => {
        setCodes([])
        setAddress(window.starcoin.selectedAddress)
    }

    useEffect(() => {

        if(window.starcoin) {
            if (window.starcoin.selectedAddress) {
                setAddress(window.starcoin.selectedAddress)
                setAddressOptions([window.starcoin.selectedAddress, '0x1'])
            }
            
            window.starcoin.on("accountsChanged", accountsChanged)
            window.starcoin.on("chainChanged", chainChanged)
            
        
            return () => {
                window.starcoin.removeListener("accountsChanged", accountsChanged)
                window.starcoin.removeListener("chainChanged", chainChanged)
            }
        }

    }, [])

    const getCode = async (addr: string) => {

        setLoading(true)

        getAddressCode(addr ?? address).then((v) => {

            setLoading(false)

            if (v.length === 0) {
                setCodes(v)
                showSuccess(t('contract_call.no_code'))
                return
            }

            setCodes(v)

            setModuleOptions(moduleOptions => {
                let data = v.map((item: any, index: any) => {
                    return item.name
                })

                setModuleId(data[0])

                return data
            })

        }).catch((e) => {
            setLoading(false)

            showError(e)
        })
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>

                <Stack spacing={2}>
                    <Typography variant="h5" component="div">
                        {t("contract_call.title")}
                    </Typography>
                    <Stack direction="row" spacing={2}
                    >
                        <Autocomplete
                            selectOnFocus
                            value={address}
                            onChange={(e, v) => {
                                if (v && v !== address) {
                                    setAddress(v)
                                    setCodes([])
                                }
                            }}
                            id="address_options"
                            options={addressOptions}

                            fullWidth
                            renderInput={(params) => <TextField {...params} label={t("contract_call.address")} onChange={(e: any) => {
                                if (e) {
                                    setAddress(e.target.value)
                                }
                            }} />}
                        />
                        <Button variant="contained" onClick={() => getCode(address)}>{t("contract_call.resolve")}</Button>


                    </Stack>
                    {
                        codes.length > 0 ? <Autocomplete
                            disablePortal
                            selectOnFocus
                            value={modlueId}
                            onChange={(e, v) => {
                                if (v) {
                                    setModuleId(v)
                                }
                            }}
                            id="module_oprions"
                            options={moduleOptions}
                            fullWidth
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label={t("contract_call.module")} />}
                        /> : <div />
                    }
                    {
                        codes.length > 0 ?
                            <Typography variant="h5" component="div">
                                {t("contract_call.script_function")}
                            </Typography> : <div />
                    }

                    {loading ?
                        <Box>< CircularProgress color="inherit" size={30} /></Box> : <CodeContent codes={codes.filter((v: any) => v.name === modlueId || modlueId === 'all')} />}
                </Stack>
                <Snackbar open={openTips} autoHideDuration={6000} onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={tipsType} sx={{ width: '100%' }}>
                        {tips}
                    </Alert>
                </Snackbar>
            </CardContent>

        </Card >
    );
}
